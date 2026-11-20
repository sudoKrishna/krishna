"use client";

import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { drawRoad, stops } from "./scenes";
import { useCanvas } from "./use-canvas";
import styles from "./article.module.css";

const chapters = [
  ["top", "GPU cutaway"],
  ["request", "From prompt to token"],
  ["memory", "What fits in memory"],
  ["cost", "Serving costs"],
  ["roadmap", "Learning roadmap"],
] as const;

export function ArticleNavigation() {
  const [active, setActive] = useState("top");
  const { scrollY, scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const progress = useSpring(scrollYProgress, {
    stiffness: 210,
    damping: 38,
    skipInitialAnimation: true,
  });

  const updateChapter = useCallback(() => {
    const threshold = window.innerHeight * 0.3;
    const reached = chapters.findLast(
      ([id]) =>
        (document.getElementById(id)?.getBoundingClientRect().top ??
          Infinity) <= threshold,
    );
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
    window.addEventListener("resize", updateChapter);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.removeEventListener("resize", updateChapter);
    };
  }, [updateChapter]);

  return (
    <>
      <motion.div
        className={styles.readingProgress}
        aria-hidden="true"
        style={{ scaleX: reduce ? scrollYProgress : progress }}
      />
      <aside className={styles.sidebar}>
        <Link className={styles.back} href="/#blog">
          Back to portfolio
        </Link>
        <h2 id="contents-heading">On this page</h2>
        <nav className={styles.chapters} aria-labelledby="contents-heading">
          {chapters.map(([id, title]) => (
            <a
              href={"#" + id}
              key={id}
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
                window.history.pushState(null, "", "#" + id);
                chapter.focus({ preventScroll: true });
                chapter.scrollIntoView({
                  behavior: reduce ? "instant" : "smooth",
                });
              }}
            >
              {title}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}

const prompt = ["Why", "is", "inference", "expensive", "?"];
const answer = ["Moving", "model", "weights", "takes", "bandwidth", "."];
const stages = [
  [
    "Prompt",
    "The serving API tokenizes and queues the request. The chips show illustrative tokens.",
  ],
  [
    "Prefill",
    "The GPU processes the prompt in parallel and builds the KV cache. The last prompt position provides logits for the first generated token.",
  ],
  [
    "Decode",
    "Each decode step samples a token from logits and streams it to the client. The new token becomes input to the next step.",
  ],
];

export function TokenPipeline() {
  const [stage, setStage] = useState(0);
  const [generated, setGenerated] = useState(0);
  const reduce = useReducedMotion();
  const done = generated === answer.length;
  const description = done
    ? "The example response is complete."
    : stages[stage][1] +
      (generated ? " Latest token: " + answer[generated - 1] : "");

  return (
    <div className={[styles.panel, styles.pipeline].join(" ")}>
      <div className={styles.steps} aria-label="Request stages" role="group">
        {stages.map(([label], index) => (
          <button
            key={label}
            type="button"
            aria-pressed={index === stage}
            onClick={() => {
              setStage(index);
              setGenerated(0);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.tokenRow} aria-label="Illustrative token sequence">
        {prompt.map((token) => (
          <span className={styles.token} key={token}>
            {token}
          </span>
        ))}
        {stage === 2 &&
          answer.slice(0, generated).map((token) => (
            <motion.span
              className={styles.token}
              key={token}
              initial={reduce ? false : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.19 }}
            >
              {token}
            </motion.span>
          ))}
      </div>
      <p className={styles.legend} aria-live="polite">
        {description}
      </p>
      {stage === 2 && (
        <div className={[styles.actions, styles.tokenActions].join(" ")}>
          <button
            type="button"
            disabled={done}
            onClick={() => setGenerated((count) => count + 1)}
          >
            Generate next token
          </button>
          <button type="button" onClick={() => setGenerated(0)}>
            Reset decode
          </button>
        </div>
      )}
    </div>
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
        <label>
          Weight precision
          <select
            value={precision}
            onChange={(event) => setPrecision(Number(event.target.value))}
          >
            <option value={2}>BF16 · 16 bits</option>
            <option value={1}>INT8 · 8 bits</option>
            <option value={0.5}>INT4 · 4 bits</option>
          </select>
        </label>
        <label>
          Context per request
          <select
            value={context}
            onChange={(event) => setContext(Number(event.target.value))}
          >
            {[
              [2048, "2,048"],
              [8192, "8,192"],
              [32768, "32,768"],
            ].map(([value, label]) => (
              <option key={value} value={value}>
                {label} tokens
              </option>
            ))}
          </select>
        </label>
        <label>
          Concurrent requests
          <select
            value={concurrency}
            onChange={(event) => setConcurrency(Number(event.target.value))}
          >
            {[1, 4, 8, 16].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <label>
          GPU memory budget
          <select
            value={capacity}
            onChange={(event) => setCapacity(Number(event.target.value))}
          >
            {[16, 24, 48, 80].map((n) => (
              <option key={n} value={n}>
                {n} GiB
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.bar} aria-hidden="true">
        <motion.span
          data-weight
          initial={false}
          animate={{ width: (weight / scale) * 100 + "%" }}
          transition={{ duration: reduce ? 0 : 0.28 }}
        />
        <motion.span
          data-cache
          initial={false}
          animate={{ width: (kv / scale) * 100 + "%" }}
          transition={{ duration: reduce ? 0 : 0.28 }}
        />
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
            <b>{value.toFixed(2)} GiB</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <p className={styles.state} aria-live="polite">
        {Math.abs(remaining).toFixed(2)} GiB{" "}
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
        {valid
          ? usd.format(cost) + " per million output tokens"
          : "Enter a nonnegative hourly price and throughput of at least one token per second."}
      </p>
      <p className={styles.formula}>
        Fleet hourly cost × 1,000,000 ÷ (effective output tokens per second ×
        3,600). Covers the GPU cost you enter.
      </p>
    </div>
  );
}

export function Roadmap() {
  const [stop, setStop] = useState(0);
  const reduce = useReducedMotion();
  const position = useSpring(0, { stiffness: 95, damping: 24 });
  const { canvas, redraw } = useCanvas((ctx, width, height) => {
    const marker = Math.max(0, Math.min(1, position.get()));
    drawRoad(ctx, width, height, marker, stop);
  });
  useMotionValueEvent(position, "change", redraw);

  function select(index: number) {
    setStop(index);
    const target = index / (stops.length - 1);
    if (reduce) position.jump(target);
    else position.set(target);
  }

  return (
    <div className={[styles.panel, styles.road].join(" ")}>
      <div className={styles.stage}>
        <canvas
          ref={canvas}
          role="img"
          aria-label="Animated 3D learning road with five stops"
        />
      </div>
      <div className={styles.roadDetail}>
        <div
          className={styles.roadControls}
          aria-label="Roadmap stops"
          role="group"
        >
          {stops.map(([title], index) => (
            <button
              key={title}
              type="button"
              aria-label={title}
              aria-current={index === stop ? "step" : undefined}
              onClick={() => select(index)}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        <div aria-live="polite">
          <motion.div
            key={stop}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <h3>{stops[stop][0]}</h3>
            <p>{stops[stop][1]}</p>
            <p>{stops[stop][2]}</p>
          </motion.div>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            disabled={stop === 0}
            onClick={() => select(stop - 1)}
          >
            Previous stop
          </button>
          <button
            type="button"
            disabled={stop === stops.length - 1}
            onClick={() => select(stop + 1)}
          >
            Next stop
          </button>
        </div>
      </div>
    </div>
  );
}
