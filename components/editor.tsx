"use client";

import { useDirection } from "@base-ui/react/direction-provider";
import {
  IconArrowRight,
  IconBold,
  IconCode,
  IconItalic,
  IconStrikethrough,
  IconUnderline,
} from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Orb, type OrbVariant } from "@/components/ui/orb";
import { StreamingText } from "@/components/ui/streaming-text";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { SelectHint } from "@/components/select-hint";
import { cn } from "@/lib/utils";
import { playSound, SOUNDS } from "@/app/lib/sound";

// ─── constants ───────────────────────────────────────────────────────────────

const EASE = [0.16, 1, 0.3, 1] as const;
const EXIT = { duration: 0.15, ease: [0.4, 0, 0.2, 1] } as const;
const SETTLE = 250;
const ANSWER_WORD_MS = 28;

// ─── types ────────────────────────────────────────────────────────────────────

type Format = "bold" | "italic" | "underline" | "strikethrough" | "code";

// ─── format config ────────────────────────────────────────────────────────────

const FORMATS = [
  { name: "Bold", format: "bold", icon: IconBold },
  { name: "Italic", format: "italic", icon: IconItalic },
  { name: "Underline", format: "underline", icon: IconUnderline },
  { name: "Strikethrough", format: "strikethrough", icon: IconStrikethrough },
  { name: "Code", format: "code", icon: IconCode },
] as const satisfies ReadonlyArray<{ name: string; format: Format; icon: unknown }>;

const ARRIVE_MS: Record<Format, number> = {
  bold: 220,
  italic: 220,
  underline: 260,
  strikethrough: 260,
  code: 220,
};

const LEAVE_MS: Record<Format, number> = {
  bold: 160,
  italic: 160,
  underline: 180,
  strikethrough: 180,
  code: 160,
};

const SHORTCUTS: Partial<Record<string, Format>> = {
  b: "bold",
  i: "italic",
  u: "underline",
};

// ─── toolbar transition classes ───────────────────────────────────────────────

const SWAP =
  "transition-[opacity,filter,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

const OUT = `${SWAP} group-data-ask:pointer-events-none group-data-ask:-translate-x-2 rtl:group-data-ask:translate-x-2 group-data-ask:opacity-0 group-data-ask:blur-[2px]`;

const IN = `pointer-events-none translate-x-2 rtl:-translate-x-2 opacity-0 blur-[2px] delay-100 ${SWAP} group-data-ask:pointer-events-auto group-data-ask:translate-x-0 group-data-ask:opacity-100 group-data-ask:blur-none group-data-sent:pointer-events-none group-data-sent:-translate-x-2 rtl:group-data-sent:translate-x-2 group-data-sent:opacity-0 group-data-sent:blur-[2px] group-data-sent:delay-0`;

const SENT = `pointer-events-none translate-x-2 rtl:-translate-x-2 opacity-0 blur-[2px] delay-100 ${SWAP} group-data-sent:translate-x-0 group-data-sent:opacity-100 group-data-sent:blur-none`;

// ─── ask panel config ─────────────────────────────────────────────────────────

const SOURCES = ["wikipedia.org", "reddit.com", "chatgpt.com"];

const STAGES = {
  understanding: { label: "Understanding the context…", orb: "S3" },
  gathering: { label: "Gathering sources…", orb: "S2" },
} as const satisfies Record<string, { label: string; orb: OrbVariant }>;

// ─── helpers: selection / range ───────────────────────────────────────────────

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const rewrites = new WeakMap<Element, number>();

function offsetsOf(root: HTMLElement) {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return null;
  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer))
    return null;
  const from = (container: Node, offset: number) => {
    const span = document.createRange();
    span.setStart(root, 0);
    span.setEnd(container, offset);
    return span.toString().length;
  };
  return {
    start: from(range.startContainer, range.startOffset),
    end: from(range.endContainer, range.endOffset),
  };
}

function restore(
  root: HTMLElement,
  offsets: { start: number; end: number } | null,
) {
  if (!offsets) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let seen = 0;
  let started = false;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const length = (node as Text).length;
    if (!started && offsets.start <= seen + length) {
      range.setStart(node, offsets.start - seen);
      started = true;
    }
    if (started && offsets.end <= seen + length) {
      range.setEnd(node, offsets.end - seen);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      return;
    }
    seen += length;
  }
}

function keepSelection(root: HTMLElement, rebuild: () => void) {
  const offsets = offsetsOf(root);
  rebuild();
  rewrites.set(root, performance.now());
  restore(root, offsets);
}

// ─── helpers: marks ───────────────────────────────────────────────────────────

function markOf(node: Node, format: Format, root: HTMLElement) {
  const mark = node.parentElement?.closest<HTMLElement>(
    `.editor-mark[data-format="${format}"]:not([data-leaving])`,
  );
  return mark && root.contains(mark) ? mark : null;
}

function splitText(range: Range, root: HTMLElement) {
  const { startContainer: start, startOffset, endContainer: end, endOffset } = range;
  if (end instanceof Text && endOffset < end.length) end.splitText(endOffset);
  if (start instanceof Text && startOffset > 0 && startOffset < start.length) {
    const tail = start.splitText(startOffset);
    range.setStart(tail, 0);
    if (end === start) range.setEnd(tail, tail.length);
  }
  return textWithin(range, root);
}

function textWithin(range: Range, root: HTMLElement, partly = false) {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node as Text;
    if (!text.length) continue;
    const inside = partly
      ? range.intersectsNode(text) &&
        !(range.startContainer === text && range.startOffset === text.length) &&
        !(range.endContainer === text && range.endOffset === 0)
      : range.comparePoint(text, 0) === 0 &&
        range.comparePoint(text, text.length) === 0;
    if (inside) nodes.push(text);
  }
  return nodes;
}

function formatsOf(range: Range, root: HTMLElement) {
  const nodes = textWithin(range, root, true);
  return new Set(
    FORMATS.map(({ format }) => format).filter(
      (format) => nodes.length > 0 && nodes.every((node) => markOf(node, format, root)),
    ),
  );
}

function unwrap(element: Element) {
  const parent = element.parentNode;
  if (!parent) return;
  while (element.firstChild) parent.insertBefore(element.firstChild, element);
  parent.removeChild(element);
}

function textsIn(element: Element) {
  const texts: Text[] = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode())
    if ((node as Text).length) texts.push(node as Text);
  return texts;
}

function markRuns(nodes: Text[], format: Format) {
  const covered = new Set<Node>(nodes);
  const units: Node[] = [];

  for (const node of nodes) {
    let unit: Node = node;
    for (
      let parent = unit.parentElement;
      parent?.matches(".editor-mark, .editor-word") &&
      textsIn(parent).every((text) => covered.has(text));
      parent = unit.parentElement
    )
      unit = parent;
    if (units.at(-1) !== unit) units.push(unit);
  }

  const marks: HTMLElement[] = [];
  let run: Node[] = [];

  const close = () => {
    const first = run[0];
    if (!first) return;
    const mark = document.createElement("span");
    mark.className = "editor-mark";
    mark.dataset.format = format;
    first.parentNode?.insertBefore(mark, first);
    for (const unit of run) mark.appendChild(unit);
    marks.push(mark);
    run = [];
  };

  for (const unit of units) {
    if (run.length && run.at(-1)?.nextSibling !== unit) close();
    run.push(unit);
  }
  close();
  return marks;
}

function isolate(mark: HTMLElement, first: Node, last: Node) {
  const head = document.createRange();
  head.setStart(mark, 0);
  head.setEndBefore(first);
  if (!head.collapsed) {
    const piece = mark.cloneNode(false) as HTMLElement;
    piece.appendChild(head.extractContents());
    if (piece.textContent) mark.parentNode?.insertBefore(piece, mark);
  }
  const tail = document.createRange();
  tail.setStartAfter(last);
  tail.setEnd(mark, mark.childNodes.length);
  if (!tail.collapsed) {
    const piece = mark.cloneNode(false) as HTMLElement;
    piece.appendChild(tail.extractContents());
    if (piece.textContent) mark.parentNode?.insertBefore(piece, mark.nextSibling);
  }
}

// ─── helpers: italic word-slant ──────────────────────────────────────────────

function slantWords(mark: HTMLElement) {
  const walker = document.createTreeWalker(mark, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode())
    texts.push(node as Text);

  for (const text of texts) {
    const parts = text.data.split(/(\s+)/).filter(Boolean);
    if (parts.length === 1 && /\s/.test(parts[0] ?? "")) continue;
    const fragment = document.createDocumentFragment();
    for (const part of parts) {
      if (/^\s+$/.test(part)) {
        fragment.appendChild(document.createTextNode(part));
        continue;
      }
      const word = document.createElement("span");
      word.className = "editor-word";
      word.textContent = part;
      fragment.appendChild(word);
    }
    text.parentNode?.replaceChild(fragment, text);
  }
}

function unslantWords(mark: HTMLElement) {
  for (const word of mark.querySelectorAll(".editor-word")) unwrap(word);
  mark.normalize();
}

// ─── helpers: bold tracking compensation ─────────────────────────────────────

function boldSpacing(mark: HTMLElement) {
  const text = mark.textContent ?? "";
  if (!text.length) return 0;
  const probe = document.createElement("span");
  probe.textContent = text;
  probe.style.cssText =
    "position:absolute;visibility:hidden;white-space:pre;font-weight:400";
  mark.parentNode?.insertBefore(probe, mark.nextSibling);
  const regular = probe.getBoundingClientRect().width;
  probe.style.fontWeight = "700";
  const bold = probe.getBoundingClientRect().width;
  probe.parentNode?.removeChild(probe);
  return (bold - regular) / text.length;
}

// ─── helpers: staggered underline / strikethrough draw ───────────────────────

function drawInTurn(marks: HTMLElement[], format: Format) {
  if (marks.length < 2 || (format !== "underline" && format !== "strikethrough"))
    return;
  const widths = marks.map((mark) =>
    [...mark.getClientRects()].reduce((sum, box) => sum + box.width, 0),
  );
  const total = widths.reduce((sum, w) => sum + w, 0) || 1;
  let before = 0;
  marks.forEach((mark, index) => {
    const width = widths[index] ?? 0;
    mark.style.transitionDelay = `${String((ARRIVE_MS[format] * before) / total)}ms`;
    mark.style.transitionDuration = `${String((ARRIVE_MS[format] * width) / total)}ms`;
    mark.style.transitionTimingFunction = "linear";
    before += width;
  });
}

// ─── helpers: arrive / leave animations ──────────────────────────────────────

function instantly(mark: HTMLElement, instant: boolean) {
  if (!instant) return;
  mark.dataset.instant = "";
  window.requestAnimationFrame(() => delete mark.dataset.instant);
}

function inFrame(mark: HTMLElement, ms: number, change: () => void) {
  if (ms) {
    window.requestAnimationFrame(() => window.requestAnimationFrame(change));
    return;
  }
  change();
  void mark.offsetWidth;
}

function arrive(mark: HTMLElement, format: Format, instant: boolean) {
  const ms = reducedMotion() || instant ? 0 : ARRIVE_MS[format];
  instantly(mark, instant);
  if (format === "bold")
    mark.style.setProperty("--editor-bold-spacing", `${String(boldSpacing(mark))}px`);
  if (format === "italic") slantWords(mark);
  void mark.offsetWidth;
  inFrame(mark, ms, () => {
    mark.dataset.on = "";
    if (format === "code") blurSwap(mark, ms, true);
    window.setTimeout(() => {
      mark.style.removeProperty("transition-delay");
      mark.style.removeProperty("transition-duration");
      mark.style.removeProperty("transition-timing-function");
    }, ms + 50);
  });
}

function leave(
  mark: HTMLElement,
  format: Format,
  root: HTMLElement,
  instant: boolean,
) {
  const ms = reducedMotion() || instant ? 0 : LEAVE_MS[format];
  instantly(mark, instant);
  mark.dataset.leaving = "";
  void mark.offsetWidth;
  inFrame(mark, ms, () => {
    delete mark.dataset.on;
    if (format === "code") blurSwap(mark, ms, false);
    window.setTimeout(() => {
      if (!mark.isConnected) return;
      keepSelection(root, () => {
        if (format === "italic") unslantWords(mark);
        const parent = mark.parentNode;
        unwrap(mark);
        parent?.normalize();
      });
    }, ms + 50);
  });
}

function blurSwap(mark: HTMLElement, ms: number, mono: boolean) {
  if (!ms) {
    if (mono) mark.dataset.mono = "";
    else delete mark.dataset.mono;
    return;
  }
  mark.animate(
    { filter: ["blur(0px)", "blur(2px)", "blur(0px)"], opacity: [1, 0.55, 1] },
    { duration: ms, easing: "ease-in-out" },
  );
  window.setTimeout(() => {
    if (mono) mark.dataset.mono = "";
    else delete mark.dataset.mono;
  }, ms / 2);
}

// ─── Editor ───────────────────────────────────────────────────────────────────

export function Editor({
  title,
  children,
  answer,
  className,
}: {
  title?: string;
  children: string;
  answer: string;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const prose = useRef<HTMLDivElement>(null);

  const dragging = useRef(false);
  const asking = useRef(false);

  const [at, setAt] = useState<{ x: number; y: number } | null>(null);
  const [askMode, setAskMode] = useState(false);
  const [formats, setFormats] = useState<ReadonlySet<Format>>(new Set());

  const applyFormat = useCallback((format: Format, instant = false) => {
    const root = prose.current;
    const selection = window.getSelection();
    if (!root || !selection?.rangeCount || selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    if (!root.contains(range.commonAncestorContainer)) return;
    const offsets = offsetsOf(root);

    const nodes = splitText(range, root);
    const first = nodes[0];
    const last = nodes.at(-1);
    if (!first || !last) return;

    if (nodes.every((node) => markOf(node, format, root))) {
      const owners = new Map<HTMLElement, Text[]>();
      for (const node of nodes) {
        const mark = markOf(node, format, root);
        if (mark) owners.set(mark, [...(owners.get(mark) ?? []), node]);
      }
      for (const [mark, inside] of owners) {
        isolate(mark, inside[0] ?? first, inside.at(-1) ?? last);
        leave(mark, format, root, instant);
      }
    } else {
      const marks = markRuns(
        nodes.filter((node) => !markOf(node, format, root)),
        format,
      );
      if (!instant) drawInTurn(marks, format);
      for (const mark of marks) arrive(mark, format, instant);
    }

    rewrites.set(root, performance.now());
    restore(root, offsets);
    if (selection.rangeCount) setFormats(formatsOf(selection.getRangeAt(0), root));
  }, []);

  const enterAskMode = useCallback(() => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && "highlights" in CSS) {
      CSS.highlights.set(
        "editor-ask",
        new Highlight(selection.getRangeAt(0).cloneRange()),
      );
    }
    asking.current = true;
    setAskMode(true);
  }, []);

  useEffect(() => {
    let timer = 0;

    const show = () => {
      const selection = window.getSelection();
      const proseEl = prose.current;
      const wrapEl = wrap.current;
      if (
        !selection ||
        selection.isCollapsed ||
        !proseEl ||
        !wrapEl ||
        !proseEl.contains(selection.anchorNode) ||
        !proseEl.contains(selection.focusNode)
      ) {
        setAt(null);
        return;
      }
      const box = selection.getRangeAt(0).getBoundingClientRect();
      const origin = wrapEl.getBoundingClientRect();
      setAt({ x: box.left + box.width / 2 - origin.left, y: box.top - origin.top });
      setFormats(formatsOf(selection.getRangeAt(0), proseEl));
    };

    const onSelectionChange = () => {
      const proseEl = prose.current;
      if (
        asking.current ||
        (proseEl && performance.now() - (rewrites.get(proseEl) ?? 0) < 100)
      )
        return;
      window.clearTimeout(timer);
      setAt(null);
      if (!dragging.current) timer = window.setTimeout(show, SETTLE);
    };

    const onPointerDown = (event: PointerEvent) => {
      if ((event.target as Element).closest("[data-editor-toolbar]")) return;
      if ("highlights" in CSS) CSS.highlights.delete("editor-ask");
      asking.current = false;
      setAskMode(false);
      dragging.current = true;
      window.clearTimeout(timer);
      setAt(null);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (
        asking.current ||
        (event.target as Element).closest("[data-editor-toolbar]")
      )
        return;
      dragging.current = false;
      show();
    };

    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div ref={wrap} className={cn("relative", className)}>
      <div
        ref={prose}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        role="textbox"
        aria-multiline="true"
        aria-label={title ?? "Document"}
        dir="auto"
        onKeyDown={(event) => {
          if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey)
            return;
          const format = SHORTCUTS[event.key.toLowerCase()];
          if (!format) return;
          event.preventDefault();
          applyFormat(format, true);
        }}
        className="outline-none"
      >
        {title ? (
          <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
        ) : null}
        <p className={cn("text-sm leading-relaxed text-muted-foreground", title && "mt-4")}>
          {children}
        </p>
      </div>

      <SelectHint className="-top-28 right-0" />

      <AnimatePresence>
        {at && (
          <motion.div
            key="toolbar"
            className="absolute z-50"
            style={{ left: at.x, top: at.y }}
            initial={{ opacity: 0, scale: 0.96, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.99, y: 2, transition: EXIT }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <div className="absolute bottom-1.5 left-0 -translate-x-1/2">
              <SelectionToolbar
                askMode={askMode}
                answer={answer}
                onAsk={enterAskMode}
                formats={formats}
                onFormat={(format) => applyFormat(format)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── SelectionToolbar ─────────────────────────────────────────────────────────

function SelectionToolbar({
  askMode,
  answer,
  onAsk,
  formats,
  onFormat,
}: {
  askMode: boolean;
  answer: string;
  onAsk: () => void;
  formats: ReadonlySet<Format>;
  onFormat: (format: Format) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const side = useDirection() === "rtl" ? -1 : 1;

  const [query, setQuery] = useState<string | null>(null);
  const [stage, setStage] = useState<keyof typeof STAGES>("understanding");
  const [answering, setAnswering] = useState(false);
  const [shown, setShown] = useState(0);
  const [height, setHeight] = useState(0);

  const words = answer.split(" ");

  useEffect(() => {
    const element = panel.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setHeight(element.offsetHeight));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!query) return;
    const found = window.setTimeout(() => setStage("gathering"), 2000);
    const reply = window.setTimeout(() => setAnswering(true), 4200);
    return () => {
      window.clearTimeout(found);
      window.clearTimeout(reply);
    };
  }, [query]);

  useEffect(() => {
    if (!answering || shown >= words.length) return;
    const timer = window.setTimeout(() => setShown((count) => count + 1), ANSWER_WORD_MS);
    return () => window.clearTimeout(timer);
  }, [answering, shown, words.length]);

  const submit = () => {
    const value = input.current?.value.trim();
    if (!value || query) return;
    setQuery(value);
    input.current?.blur();
  };

  return (
    <div
      role="toolbar"
      aria-label="Selection"
      data-editor-toolbar
      data-ask={askMode ? "" : undefined}
      data-sent={query ? "" : undefined}
      onMouseDown={(event) => {
        if ((event.target as HTMLElement).tagName !== "INPUT") event.preventDefault();
      }}
      className="group flex origin-bottom scale-90 flex-col overflow-hidden rounded-[22px] border border-border bg-popover whitespace-nowrap text-muted-foreground shadow-lg"
    >
      <div className="relative flex items-center gap-1 p-1.5">
        {/* ask ai button */}
        <button
          type="button"
          onMouseEnter={() => playSound(SOUNDS.hover, 0.45)}
          onClick={() => {
            playSound(SOUNDS.pop, 0.5);
            if (askMode) return;
            onAsk();
            input.current?.focus({ preventScroll: true });
          }}
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-full ps-1.5 pe-2.5 text-sm font-medium text-foreground hover:bg-accent group-data-ask:hover:bg-transparent"
        >
          <span data-stirring={askMode || undefined} className="editor-orb size-5 shrink-0" />
          <span className={OUT}>Ask AI</span>
        </button>

        {/* divider */}
        <div className={cn("mx-1 h-5 w-px shrink-0 bg-border", OUT)} />

        {/* format buttons */}
        {FORMATS.map(({ name, format, icon: Icon }) => (
          <button
            key={name}
            type="button"
            aria-label={name}
            aria-pressed={formats.has(format)}
            onClick={() => {
              playSound(SOUNDS.pop, 0.5);
              onFormat(format);
            }}
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-accent aria-pressed:bg-accent aria-pressed:text-foreground",
              OUT,
            )}
          >
            <Icon className="size-[1.125rem]" stroke={1.8} />
          </button>
        ))}

        {/* ask input */}
        <div className={cn("absolute inset-y-1.5 start-10 end-1.5 flex items-center gap-1", IN)}>
          <input
            ref={input}
            type="text"
            dir="auto"
            aria-label="Ask about the selection"
            placeholder="Ask anything…"
            onKeyDown={(event) => event.key === "Enter" && submit()}
            className="h-8 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            aria-label="Send"
            onClick={() => {
              playSound(SOUNDS.pop, 0.5);
              submit();
            }}
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
          >
            <IconArrowRight className="size-4 rtl:-scale-x-100" />
          </button>
        </div>

        {/* sent query label */}
        <div
          className={cn(
            "absolute inset-y-1.5 start-10 end-3 flex items-center overflow-hidden text-sm font-medium text-foreground",
            SENT,
          )}
        >
          <span dir="auto" className="truncate">
            {query}
          </span>
        </div>
      </div>

      {/* expandable answer panel */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: EASE }}
        className="overflow-hidden"
      >
        <div ref={panel} className="relative">
          <AnimatePresence mode="popLayout">
            {query && !answering && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
                transition={{ duration: 0.25, ease: EASE }}
                className="flex items-center gap-1 border-t border-border bg-muted/50 px-3 py-2.5"
              >
                <Orb
                  key={STAGES[stage].orb}
                  variant={STAGES[stage].orb}
                  label={STAGES[stage].label}
                  className="shrink-0 text-muted-foreground"
                />

                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={stage}
                    initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
                    transition={{ duration: 0.15, ease: EASE }}
                    className="inline-block text-sm"
                  >
                    <TextShimmer duration={1.5}>{STAGES[stage].label}</TextShimmer>
                  </motion.span>
                </AnimatePresence>

                <div className="ms-auto flex items-center ps-2">
                  {stage === "gathering" &&
                    SOURCES.map((domain, index) => (
                      <motion.img
                        key={domain}
                        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                        alt={domain}
                        initial={{ opacity: 0, x: 10 * side, scale: 0.4 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ delay: index * 0.08, duration: 0.35, ease: EASE }}
                        className="-ms-2 size-5 rounded-full bg-background ring-2 ring-popover first:ms-0"
                      />
                    ))}
                </div>
              </motion.div>
            )}

            {answering && (
              <motion.div
                key="answer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="min-h-[41px] border-t border-border bg-muted/50 px-3.5 py-3"
              >
                <p
                  dir="auto"
                  className="max-w-xs text-[15px] leading-relaxed whitespace-normal text-foreground"
                >
                  <StreamingText>{words.slice(0, shown).join(" ")}</StreamingText>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
