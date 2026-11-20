"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { tween } from "./motion-settings";
import styles from "./article.module.css";

const modules = [
  [
    "Model fundamentals",
    "Tokenization, embeddings, causal attention, and next-token sampling.",
    "Print the token IDs for one short prompt and generate a reply with a small text model.",
  ],
  [
    "Follow prefill and decode",
    "Transformer blocks, Q/K/V, the per-layer KV cache, and streaming.",
    "Time the first token and the gaps between later tokens. Repeat with a longer prompt.",
  ],
  [
    "Learn GPU memory",
    "VRAM versus host RAM, memory bandwidth, precision, and peak allocation.",
    "Estimate weight size and KV growth, then compare the estimates to measurements on a Colab GPU.",
  ],
  [
    "Serve and benchmark",
    "vLLM serving, request queues, continuous batching, and latency percentiles.",
    "Serve the model and compare p50 and p95 latency and throughput at concurrency 1, 4, and 8.",
  ],
  [
    "Optimize a bottleneck",
    "Prefix caching, chunked prefill, quantization, and quality checks. Study profiling and CUDA or Triton kernels when the bottleneck calls for it.",
    "Change one serving setting. Keep the workload fixed and measure whether quality, latency, or cost moved.",
  ],
  [
    "Build a reproducible serving project",
    "Streaming APIs, load tests, monitoring, and capacity limits.",
    "Publish your benchmark script and a before-and-after table for latency, memory, throughput, and cost.",
  ],
];

function LearningStep({ module, index }: { module: string[]; index: number }) {
  const [title, study, practice] = module;
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const content = useRef<HTMLDivElement>(null);
  const id = useId();
  const reduce = useReducedMotion();

  useEffect(() => {
    const element = content.current;
    if (!element) return;
    const observer = new ResizeObserver(() =>
      setHeight(element.getBoundingClientRect().height),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <li className={styles.flowStep}>
      <div className={styles.flowNode}>
        <h3>
          <button
            id={id + "-button"}
            type="button"
            className={styles.accordionButton}
            aria-expanded={open}
            aria-controls={id + "-practice"}
            onClick={() => setOpen(!open)}
          >
            <span>
              <span className={styles.inlineNumber} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {title}
            </span>
            <span className={styles.accordionChevron} aria-hidden="true" />
          </button>
        </h3>
        <p>{study}</p>
        <motion.div
          className={styles.accordionPanel}
          id={id + "-practice"}
          role="region"
          aria-labelledby={id + "-button"}
          aria-hidden={!open}
          inert={!open}
          initial={false}
          animate={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
          transition={tween(reduce)}
        >
          <div ref={content} className={styles.accordionContent}>
            <p>
              <strong>Try it.</strong> {practice}
            </p>
          </div>
        </motion.div>
      </div>
    </li>
  );
}

export function LearningFlow() {
  const flow = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: flow,
    offset: ["start 65%", "end 60%"],
  });
  const progress = useTransform(scrollYProgress, (value) =>
    reduce ? Math.floor(value * modules.length) / modules.length : value,
  );

  return (
    <div className={styles.flowProgress} ref={flow}>
      <div className={styles.flowTrack} aria-hidden="true">
        <motion.span style={{ scaleY: progress }} />
      </div>
      <ol
        className={styles.flowSteps}
        role="list"
        aria-label="Inference learning sequence"
      >
        {modules.map((module, index) => (
          <LearningStep module={module} index={index} key={module[0]} />
        ))}
      </ol>
    </div>
  );
}
