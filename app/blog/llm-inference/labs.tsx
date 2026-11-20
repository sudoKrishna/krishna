"use client";

import Link from "next/link";
import { Select } from "@base-ui/react/select";
import {
  animate,
  LayoutGroup,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { timing, tween } from "./motion-settings";
import styles from "./article.module.css";

const chapters = [
  ["top", "GPU cutaway"],
  ["request", "From prompt to token"],
  ["memory", "What fits in memory"],
  ["cost", "Serving costs"],
  ["roadmap", "Learning flowchart"],
] as const;

export function ArticleNavigation() {
  const [active, setActive] = useState("top");
  const [tocOpen, setTocOpen] = useState(false);
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const updateChapter = useCallback(() => {
    const threshold = window.innerHeight * 0.3;
    const reached = chapters.findLast(([id]) => {
      const heading = document.querySelector(
        `#${id} ${id === "top" ? "h1" : "h2"}`,
      );
      return (heading?.getBoundingClientRect().top ?? Infinity) <= threshold;
    });
    const remaining =
      document.documentElement.scrollHeight - window.innerHeight;
    setActive(
      remaining > 0 && scrollY.get() >= remaining - 4
        ? "roadmap"
        : (reached?.[0] ?? "top"),
    );
  }, [scrollY]);

  useMotionValueEvent(scrollY, "change", updateChapter);
  useEffect(() => {
    const initialFrame = window.requestAnimationFrame(updateChapter);
    const main = document.querySelector("[data-inference-article] main");
    const observer = new ResizeObserver(updateChapter);
    if (main) observer.observe(main);
    window.addEventListener("resize", updateChapter);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      observer.disconnect();
      window.removeEventListener("resize", updateChapter);
    };
  }, [updateChapter]);

  return (
    <LayoutGroup id="inference-chapters">
      <aside className={styles.sidebar}>
        <Link className={styles.back} href="/#blog">
          <span className={styles.backArrow} aria-hidden="true">
            ←
          </span>
          Back to portfolio
        </Link>
        <h2 id="contents-heading">On this page</h2>
        <button
          className={styles.tocToggle}
          type="button"
          aria-expanded={tocOpen}
          aria-controls="article-chapters"
          onClick={() => setTocOpen(!tocOpen)}
        >
          On this page <span className={styles.tocChevron} aria-hidden="true" />
        </button>
        <nav
          id="article-chapters"
          className={styles.chapters}
          data-open={tocOpen}
          aria-labelledby="contents-heading"
          onKeyDown={(event) => {
            if (event.key !== "Escape" || !tocOpen) return;
            setTocOpen(false);
            document
              .querySelector<HTMLButtonElement>(`.${styles.tocToggle}`)
              ?.focus();
          }}
        >
          {chapters.map(([id, title], index) => (
            <a
              href={"#" + id}
              key={id}
              data-chapter={id}
              aria-current={active === id ? "location" : undefined}
              onClick={(event) => {
                const chapter = document.getElementById(id);
                if (
                  !chapter ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.altKey ||
                  event.shiftKey
                )
                  return;
                event.preventDefault();
                setTocOpen(false);
                window.history.pushState(null, "", "#" + id);
                chapter.focus({ preventScroll: true });
                chapter.scrollIntoView({
                  behavior: reduce ? "instant" : "smooth",
                });
              }}
            >
              {active === id && (
                <motion.span
                  className={styles.chapterDot}
                  aria-hidden="true"
                  layoutId={reduce ? undefined : "active-dot"}
                  initial={false}
                  transition={tween(reduce)}
                />
              )}
              <span className={styles.chapterNumber} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {title}
            </a>
          ))}
        </nav>
      </aside>
    </LayoutGroup>
  );
}

type Option = { value: number; label: string };

function LabSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  options: Option[];
}) {
  return (
    <div className={styles.selectField}>
      <Select.Root<number>
        value={value}
        onValueChange={(next) => {
          if (next !== null) onChange(next);
        }}
        items={options}
      >
        <Select.Label>{label}</Select.Label>
        <Select.Trigger className={styles.selectTrigger}>
          <Select.Value />
          <Select.Icon className={styles.tocChevron}>
            <span aria-hidden="true" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner
            className={styles.selectPositioner}
            alignItemWithTrigger={false}
            sideOffset={5}
          >
            <Select.Popup className={styles.selectPopup}>
              <Select.List>
                {options.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    className={styles.selectItem}
                  >
                    <Select.ItemText>{option.label}</Select.ItemText>
                    <Select.ItemIndicator aria-hidden="true">
                      ✓
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

const precisionOptions = [
  { value: 2, label: "BF16 · 16 bits" },
  { value: 1, label: "INT8 · 8 bits" },
  { value: 0.5, label: "INT4 · 4 bits" },
];
const contextOptions = [2048, 8192, 32768].map((value) => ({
  value,
  label: value.toLocaleString("en-US") + " tokens",
}));
const concurrencyOptions = [1, 4, 8, 16].map((value) => ({
  value,
  label: String(value),
}));
const capacityOptions = [16, 24, 48, 80].map((value) => ({
  value,
  label: value + " GiB",
}));
const formatGiB = (value: number) => value.toFixed(2) + " GiB";

function AnimatedNumber({
  value,
  format,
}: {
  value: number;
  format: (value: number) => string;
}) {
  const reduce = useReducedMotion();
  const current = useMotionValue(value);
  const display = useTransform(current, format);
  useEffect(() => {
    if (reduce) {
      current.jump(value);
      return;
    }
    const animation = animate(current, value, tween(reduce, timing.reveal));
    return () => animation.stop();
  }, [current, reduce, value]);
  return (
    <>
      <motion.span className={styles.numeric} aria-hidden="true">
        {display}
      </motion.span>
      <span className={styles.srOnly}>{format(value)}</span>
    </>
  );
}

export function MemoryLab() {
  const [precision, setPrecision] = useState(2);
  const [context, setContext] = useState(2048);
  const [concurrency, setConcurrency] = useState(1);
  const [capacity, setCapacity] = useState(24);
  const reduce = useReducedMotion();
  const gib = 1024 ** 3;
  const weight = (8e9 * precision) / gib;
  const kv = (2 * 32 * 8 * 128 * 2 * context * concurrency) / gib;
  const total = weight + kv;
  const scale = Math.max(capacity, total);
  const remaining = capacity - total;

  return (
    <div className={[styles.panel, styles.budget].join(" ")}>
      <h3>Try a VRAM budget</h3>
      <p className={[styles.legend, styles.labIntro].join(" ")}>
        Example 8B model · 32 layers · 8 KV heads · 128 head dimension · BF16 KV
        cache
      </p>
      <div className={styles.labControls}>
        <LabSelect
          label="Weight precision"
          value={precision}
          onChange={setPrecision}
          options={precisionOptions}
        />
        <LabSelect
          label="Context per request"
          value={context}
          onChange={setContext}
          options={contextOptions}
        />
        <LabSelect
          label="Concurrent requests"
          value={concurrency}
          onChange={setConcurrency}
          options={concurrencyOptions}
        />
        <LabSelect
          label="GPU memory budget"
          value={capacity}
          onChange={setCapacity}
          options={capacityOptions}
        />
      </div>
      <div className={styles.bar} data-over={remaining < 0} aria-hidden="true">
        <motion.span
          data-weight
          initial={false}
          animate={{ scaleX: weight / scale }}
          transition={tween(reduce, timing.reveal)}
        />
        <motion.span
          className={styles.cacheBar}
          initial={false}
          animate={{ x: (weight / scale) * 100 + "%" }}
          transition={tween(reduce, timing.reveal)}
        >
          <motion.span
            data-cache
            initial={false}
            animate={{ scaleX: kv / scale }}
            transition={tween(reduce, timing.reveal)}
          />
        </motion.span>
        {remaining < 0 && (
          <motion.span
            className={styles.warningFlash}
            initial={reduce ? false : { opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={tween(reduce, timing.reveal)}
          />
        )}
      </div>
      <div className={styles.metrics} aria-live="polite">
        {(
          [
            ["Weights", weight],
            ["KV cache", kv],
            ["Combined", total],
          ] as const
        ).map(([label, value]) => (
          <div className={styles.metric} key={label}>
            <b>
              <AnimatedNumber value={value} format={formatGiB} />
            </b>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <p className={styles.state} data-over={remaining < 0} aria-live="polite">
        <AnimatedNumber value={Math.abs(remaining)} format={formatGiB} />{" "}
        {remaining >= 0
          ? "left for runtime overhead on this budget."
          : "over budget before runtime overhead."}
      </p>
      <p className={styles.formula}>
        Weight bytes = parameters × bytes per weight. KV bytes = 2 × layers × KV
        heads × head dimension × bytes per KV value × context × active
        sequences.
      </p>
      <p className={styles.formula}>
        Memory figures use GiB. The estimate assumes equally long requests and
        excludes runtime buffers, activations, allocator overhead and
        quantization metadata.
      </p>
    </div>
  );
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 4,
});

const formatUSD = (value: number) => usd.format(value);

export function CostLab() {
  const [hourly, setHourly] = useState("2");
  const [throughput, setThroughput] = useState("350");
  const cost = (Number(hourly) * 1_000_000) / (Number(throughput) * 3600);
  const valid =
    hourly.trim() !== "" &&
    Number(hourly) >= 0 &&
    Number(throughput) >= 1 &&
    Number.isFinite(cost);

  return (
    <div className={[styles.panel, styles.cost].join(" ")}>
      <h3>Estimate GPU cost per million output tokens</h3>
      <p className={[styles.legend, styles.labIntro].join(" ")}>
        Enter effective output throughput over the billed hour, including idle
        time.
      </p>
      <div className={styles.labControls}>
        <label>
          Fleet cost per hour (USD)
          <input
            type="number"
            min="0"
            step="0.05"
            value={hourly}
            onChange={(event) => setHourly(event.target.value)}
          />
        </label>
        <label>
          Fleet output tokens per second
          <input
            type="number"
            min="1"
            step="1"
            value={throughput}
            onChange={(event) => setThroughput(event.target.value)}
          />
        </label>
      </div>
      <p className={styles.state} aria-live="polite">
        {valid ? (
          <>
            <AnimatedNumber value={cost} format={formatUSD} /> per million
            output tokens
          </>
        ) : (
          "Enter a nonnegative hourly price and throughput of at least one token per second."
        )}
      </p>
      <p className={styles.formula}>
        Fleet hourly cost × 1,000,000 ÷ (effective output tokens per second ×
        3,600). Covers the GPU cost you enter.
      </p>
    </div>
  );
}
