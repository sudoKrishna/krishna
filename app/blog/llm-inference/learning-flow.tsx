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

export function LearningFlow() {
  return (
    <details className={styles.learningFlow}>
      <summary>
        <span>Open the full inference learning flowchart</span>
      </summary>
      <ol className={styles.flowSteps} aria-label="Inference learning sequence">
        {modules.map(([title, study, practice], index) => (
          <li key={title}>
            <span className={styles.flowNumber} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3>{title}</h3>
              <p>{study}</p>
              <p>
                <strong>Try it.</strong> {practice}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </details>
  );
}
