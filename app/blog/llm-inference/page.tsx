import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { GpuExplorer } from "./gpu";
import {
  ArticleNavigation,
  CostLab,
  MemoryLab,
  Roadmap,
  TokenPipeline,
} from "./labs";
import styles from "./article.module.css";

const serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--article-serif",
});
const sans = Manrope({ subsets: ["latin"], variable: "--article-sans" });

export const metadata: Metadata = {
  title: "Why is LLM inference so hard? | Krishna Chaudhary",
  description:
    "An interactive guide to LLM inference, GPU memory, serving costs, and learning vLLM.",
};

export default function InferenceArticle() {
  return (
    <div className={[styles.root, serif.variable, sans.variable].join(" ")}>
      <div className={styles.layout}>
        <ArticleNavigation />
        <main className={styles.main}>
          <header className={styles.hero} id="top" tabIndex={-1}>
            <p className={styles.kicker}>LLM serving</p>
            <h1>Why is LLM inference so hard?</h1>
            <p className={styles.intro}>
              A chat response starts with a prompt and arrives one token at a
              time. Here’s what the GPU does between those two moments, where
              the cost comes from, and how to measure it yourself.
            </p>
            <p className={styles.byline}>Krishna Chaudhary</p>
            <GpuExplorer />
          </header>
          <article className={styles.sections}>
            <section
              id="request"
              tabIndex={-1}
              className={styles.chapterSection}
            >
              <div className={styles.sectionGrid}>
                <div>
                  <p className={styles.kicker}>The request</p>
                  <h2>One prompt, two kinds of work.</h2>
                </div>
                <div className={styles.prose}>
                  <p>
                    Training learns the weights.{" "}
                    <strong>
                      Inference uses those weights to produce something a user
                      can consume
                    </strong>{" "}
                    every time a chat app answers, a coding assistant suggests a
                    line, or an agent picks its next action. The serving system
                    tokenizes input, queues requests, runs the model and streams
                    output back.
                  </p>
                  <p>
                    <strong>Prefill</strong> processes prompt tokens in parallel
                    and builds the attention key/value cache. Long prompts add
                    work before the first token. <strong>Decode</strong>{" "}
                    normally produces one new token per sequence per step. Each
                    step depends on the tokens that came before it. For small
                    batches, moving weights and cached data can dominate the
                    step even when the GPU has compute capacity to spare.
                  </p>
                </div>
              </div>
              <TokenPipeline />
              <div className={[styles.prose, styles.followUp].join(" ")}>
                <p>
                  During traffic spikes, long prompts and long outputs can delay
                  short requests. Measure{" "}
                  <strong>time to first token (TTFT)</strong> from request start
                  to first streamed token, <strong>inter-token latency</strong>{" "}
                  during streaming, and aggregate output tokens per second.
                  Track p95 alongside averages so slow requests stay visible.
                  Chunked prefill breaks long prefills into pieces that a
                  scheduler can interleave with decode work.
                </p>
              </div>
            </section>
            <section
              id="memory"
              tabIndex={-1}
              className={styles.chapterSection}
            >
              <div className={styles.sectionGrid}>
                <div>
                  <p className={styles.kicker}>GPU memory</p>
                  <h2>Fitting the weights is step one.</h2>
                </div>
                <div className={styles.prose}>
                  <p>
                    <strong>Host RAM</strong> serves the CPU and can stage model
                    files or offloaded data. <strong>VRAM</strong> sits close to
                    the GPU compute and holds active weights, the KV cache and
                    working buffers. Offloading can stretch capacity, but
                    transfers over the host link can add latency.
                  </p>
                  <p>
                    Weights are shared across requests. A KV cache grows with
                    every active sequence as tokens accumulate. VRAM{" "}
                    <strong>capacity</strong> determines what fits. Memory{" "}
                    <strong>bandwidth</strong> determines how quickly the GPU
                    can read it.
                  </p>
                </div>
              </div>
              <MemoryLab />
            </section>
            <section id="cost" tabIndex={-1} className={styles.chapterSection}>
              <div className={styles.sectionGrid}>
                <div>
                  <p className={styles.kicker}>Serving economics</p>
                  <h2>Make each GPU-hour count.</h2>
                </div>
                <div className={styles.prose}>
                  <p>
                    Cost depends on the useful work a fleet completes under its
                    latency target. An API can become cheaper per token as you
                    batch more requests, up until users start waiting too long.
                    Benchmark the prompt and output lengths your product
                    actually sees.
                  </p>
                </div>
              </div>
              <CostLab />
              <div className={styles.levers}>
                <div className={[styles.panel, styles.lever].join(" ")}>
                  <h3>Continuous batching</h3>
                  <p>
                    Fill freed slots as requests finish. Compare throughput and
                    p95 latency at several arrival rates.
                  </p>
                </div>
                <div className={[styles.panel, styles.lever].join(" ")}>
                  <h3>Quantize weights</h3>
                  <p>
                    Try fewer bits per weight when memory is tight. Measure
                    quality and kernel speed on your GPU.
                  </p>
                </div>
                <div className={[styles.panel, styles.lever].join(" ")}>
                  <h3>Reuse prompt prefixes</h3>
                  <p>
                    Reuse cached KV for repeated token prefixes. Record the hit
                    rate and TTFT gain. New output still needs decode.
                  </p>
                </div>
                <div className={[styles.panel, styles.lever].join(" ")}>
                  <h3>Page the KV cache</h3>
                  <p>
                    Allocate KV in blocks as sequences grow. Lower fragmentation
                    can let more requests fit in a batch.
                  </p>
                </div>
                <div className={[styles.panel, styles.lever].join(" ")}>
                  <h3>Match model to workload</h3>
                  <p>
                    Try a smaller model for requests it can handle. Measure task
                    quality before routing live traffic.
                  </p>
                </div>
                <div className={[styles.panel, styles.lever].join(" ")}>
                  <h3>Right-size capacity</h3>
                  <p>
                    Track queue depth and idle time. Tune replicas and context
                    limits around measured traffic and latency.
                  </p>
                </div>
              </div>
            </section>
            <section
              id="roadmap"
              tabIndex={-1}
              className={styles.chapterSection}
            >
              <div className={styles.sectionGrid}>
                <div>
                  <p className={styles.kicker}>Learning roadmap</p>
                  <h2>From one token to a serving system.</h2>
                </div>
                <div className={styles.prose}>
                  <p>
                    Start with a small text model, then repeat the GPU
                    experiments on Colab. Each stop ends with a measurement you
                    can include in a project write-up.
                  </p>
                </div>
              </div>
              <Roadmap />
            </section>
          </article>

          <footer className={styles.sources}>
            <h3>Further reading</h3>
            <ul>
              <li>
                <a href="https://developer-blogs.nvidia.com/wp-content/uploads/2024/08/S62797-LLM-Inference-Sizing_-Benchmarking-End-to-End-Inference-Systems.pdf">
                  NVIDIA · LLM inference sizing and benchmarks
                </a>
              </li>
              <li>
                <a href="https://arxiv.org/abs/2309.06180">
                  PagedAttention · Efficient memory management for LLM serving
                </a>
              </li>
              <li>
                <a href="https://docs.vllm.ai/en/stable/configuration/optimization/">
                  vLLM · Optimization and tuning
                </a>
              </li>
              <li>
                <a href="https://docs.vllm.ai/en/stable/features/automatic_prefix_caching/">
                  vLLM · Automatic prefix caching
                </a>
              </li>
            </ul>
          </footer>
        </main>
      </div>
    </div>
  );
}
