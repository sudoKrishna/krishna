import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import { GpuExplorer } from "./gpu";
import { ArticleNavigation, CostLab, MemoryLab } from "./labs";
import { LearningFlow } from "./learning-flow";
import { TokenPipeline } from "./token-pipeline";
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

function ChapterNumber({ number }: { number: string }) {
  return (
    <span className={styles.inlineNumber} aria-hidden="true">
      {number}
    </span>
  );
}

function StoryPoints({
  points,
}: {
  points: [title: string, detail: string][];
}) {
  return (
    <ul className={styles.storyPoints} aria-label="Chapter checkpoints">
      {points.map(([title, detail]) => (
        <li key={title}>
          <strong>{title}</strong>
          <span>{detail}</span>
        </li>
      ))}
    </ul>
  );
}

export default function InferenceArticle() {
  return (
    <div
      data-inference-article
      className={[styles.root, serif.variable, sans.variable].join(" ")}
    >
      <div className={styles.layout}>
        <ArticleNavigation />
        <main className={styles.main}>
          <header
            className={styles.hero}
            id="top"
            data-chapter="top"
            tabIndex={-1}
          >
            <h1>
              <ChapterNumber number="01" />
              Why is LLM inference so hard?
            </h1>
            <p className={styles.intro}>
              You type “Why is inference expensive?” and press Enter. Before the
              first word appears, a server tokenizes your prompt, admits the
              request to a batch, and hands it to a model already loaded on a
              GPU. Follow that one request from arrival to the end of its reply.
            </p>
            <p className={styles.byline}>Krishna Chaudhary</p>
            <section className={styles.career} aria-labelledby="career-heading">
              <h2 id="career-heading">Why learn inference engineering?</h2>
              <p>
                Inference engineers make deployed models respond quickly and
                reliably within a GPU budget. It is where backend skills meet
                GPU systems: design the serving API, measure latency under load,
                then find out whether the bottleneck is the queue, compute, or
                memory traffic.
              </p>
              <div className={styles.payGrid}>
                <div>
                  <h3>India · early-career benchmark</h3>
                  <p>
                    <strong>₹8–14 lakh per year</strong>
                  </p>
                  <p>
                    Naukri’s Q1 2026 CTC range for ML engineers with 0–2 years
                    of experience in Bengaluru, Hyderabad, and Pune. This is a
                    broader ML benchmark.
                  </p>
                  <a href="https://www.naukri.com/career-advice/ai-jobs-career-guide-india">
                    Naukri salary data
                  </a>
                </div>
                <div>
                  <h3>United States · specialist example</h3>
                  <p>
                    <strong>$350,000–$850,000 per year</strong>
                  </p>
                  <p>
                    Anthropic’s advertised annual salary for a Performance
                    Engineer, Inference Systems. This range applies to one
                    employer and posting.
                  </p>
                  <a href="https://job-boards.greenhouse.io/anthropic/jobs/5224564008">
                    Anthropic job posting
                  </a>
                </div>
              </div>
            </section>
            <GpuExplorer />
            <StoryPoints
              points={[
                [
                  "At the server",
                  "If the current batch is full, your request waits. That queue time counts toward what you experience before the first token.",
                ],
                [
                  "On the GPU",
                  "The model’s weights are already in VRAM in this example. Open the exploded view to see where the weights and the request’s temporary memory live.",
                ],
              ]}
            />
          </header>
          <article className={styles.sections}>
            <section
              id="request"
              data-chapter="request"
              tabIndex={-1}
              className={styles.chapterSection}
            >
              <div className={styles.sectionGrid}>
                <div>
                  <h2>
                    <ChapterNumber number="02" />
                    One prompt, two kinds of work.
                  </h2>
                </div>
                <div className={styles.prose}>
                  <p>
                    The server can now run <strong>prefill</strong>. The model
                    processes your prompt positions together, applies causal
                    attention, and saves their keys and values in the KV cache.
                    The final prompt position supplies the scores for the first
                    token in this example, “Moving.”
                  </p>
                  <p>
                    <strong>Decode</strong> picks up from there. The next
                    forward pass takes “Moving” as input and uses the cache to
                    predict “model.” Repeat that loop and the response streams
                    out: “Moving model weights takes bandwidth.”
                  </p>
                </div>
              </div>
              <TokenPipeline />
              <StoryPoints
                points={[
                  [
                    "Before “Moving”",
                    "Time to first token includes waiting and the work to prefill the prompt and stream its first token.",
                  ],
                  [
                    "Between “Moving” and “model”",
                    "Inter-token latency measures the gap the reader feels while the reply is streaming.",
                  ],
                ]}
              />
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
              data-chapter="memory"
              tabIndex={-1}
              className={styles.chapterSection}
            >
              <div className={styles.sectionGrid}>
                <div>
                  <h2>
                    <ChapterNumber number="03" />
                    Fitting the weights is step one.
                  </h2>
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
              <StoryPoints
                points={[
                  [
                    "Stretch the conversation",
                    "Raise context length in the calculator. The KV cache grows while the weight estimate stays the same.",
                  ],
                  [
                    "Add more conversations",
                    "Raise concurrency at the same context length. Active sequences need their own KV entries in this estimate, while the model’s weights stay shared.",
                  ],
                ]}
              />
            </section>
            <section
              id="cost"
              data-chapter="cost"
              tabIndex={-1}
              className={styles.chapterSection}
            >
              <div className={styles.sectionGrid}>
                <div>
                  <h2>
                    <ChapterNumber number="04" />
                    Make each GPU-hour count.
                  </h2>
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
              <StoryPoints
                points={[
                  [
                    "One request is quick. What happens at eight?",
                    "Batching can raise output tokens per second. Check p95 time to first token and p95 inter-token latency before deciding how far to push it.",
                  ],
                  [
                    "Use cost to compare runs",
                    "At an illustrative $2 per GPU-hour, raising effective output throughput from 350 to 700 tokens per second takes the estimate from about $1.59 to $0.79 per million output tokens.",
                  ],
                ]}
              />
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
              data-chapter="roadmap"
              tabIndex={-1}
              className={styles.chapterSection}
            >
              <h2>
                <ChapterNumber number="05" />
                What to learn for inference engineering
              </h2>
              <p className={styles.prose}>
                Start with one short prompt and work toward a serving benchmark
                you can reproduce. Follow the steps in order, from tokenization
                to benchmarking and optimization.
              </p>
              <LearningFlow />
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
                <a href="https://huggingface.co/docs/transformers/en/cache_explanation">
                  Hugging Face · How the Transformer KV cache works
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
