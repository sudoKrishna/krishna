"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./article.module.css";

const prompt = ["Why", "is", "inference", "expensive", "?"];
const answer = ["Moving", "model", "weights", "takes", "bandwidth", "."];
const tabs = ["Prompt", "Prefill", "Decode"] as const;
type Stage = (typeof tabs)[number];

const prefill = [
  [
    "Embed in parallel",
    "The GPU looks up an embedding vector for each prompt token. All five positions can enter the same forward pass.",
  ],
  [
    "Apply causal attention",
    "Each layer projects token vectors into queries, keys, and values. A query scores the keys at its own position and earlier positions. The causal mask blocks future positions. Those scores weight the corresponding values.",
  ],
  [
    "Write the KV cache",
    "Each attention layer saves its key and value vectors for all prompt positions. Later decode passes reuse those vectors. The illustration shows one layer.",
  ],
  [
    "Score the first token",
    "The final layer’s output at the last prompt position goes through the language-model head. It produces vocabulary logits. Sampling from those scores gives the first output token.",
  ],
] as const;

const decode = [
  [
    "Read the cache",
    "The most recent output token enters the model. Each layer computes its new query, key, and value. Attention uses the new query with the cached keys and values plus the new position.",
  ],
  [
    "Append the new KV",
    "Each layer saves the newest input position’s key and value. The feed-forward part of the layer transforms the current hidden state as it proceeds through the model.",
  ],
  [
    "Score and stream",
    "The language-model head scores the vocabulary and the sampler chooses the next token. That token goes to the client and becomes the input to the next pass.",
  ],
] as const;

const lastDecodeFrame = 1 + (answer.length - 1) * decode.length;

export function TokenPipeline() {
  const [stage, setStage] = useState<Stage>("Prompt");
  const [frame, setFrame] = useState(0);
  const [target, setTarget] = useState(0);
  const reduce = useReducedMotion();
  const limit = stage === "Prefill" ? prefill.length - 1 : lastDecodeFrame;
  const playing = target > frame;
  const emitted =
    stage === "Decode" && frame > 0
      ? 1 + Math.floor((frame - 1) / decode.length)
      : 0;
  const decodeStep = frame > 1 ? (frame - 2) % decode.length : -1;
  const cachedOutput =
    stage === "Decode"
      ? Math.max(0, Math.floor((frame - 1) / decode.length)) +
        Number(decodeStep === 1)
      : 0;
  const cached = [...prompt, ...answer.slice(0, cachedOutput)];
  const [title, description] =
    stage === "Prompt"
      ? [
          "Tokenize the request",
          "The tokenizer splits text into pieces and maps each piece to a vocabulary ID. The server queues those IDs for the GPU. The pieces in this demo are illustrative.",
        ]
      : stage === "Prefill"
        ? prefill[frame]
        : decodeStep !== -1
          ? decode[decodeStep]
          : frame === 0
            ? [
                "First-token logits are ready",
                "Prefill has already scored the vocabulary. The sampler can choose the first output token and send it to the client.",
              ]
            : [
                "Stream the first token",
                "The sampler chose the first token from prefill’s logits. Its key and value enter the cache when the model processes that token on the next pass.",
              ];

  useEffect(() => {
    if (!playing) return;
    const timeout = window.setTimeout(
      () => setFrame((current) => current + 1),
      1050,
    );
    return () => window.clearTimeout(timeout);
  }, [frame, playing, target]);

  function select(next: Stage) {
    setStage(next);
    setFrame(0);
    setTarget(0);
  }

  function nextToken() {
    const next = frame === 0 ? 1 : Math.min(limit, 1 + emitted * decode.length);
    if (next === frame) return;
    if (frame === 0) setFrame(1);
    setTarget(next);
  }

  const enter = reduce ? false : { opacity: 0, y: 5 };
  const transition = { duration: reduce ? 0 : 0.24 };
  const showCache = (stage === "Prefill" && frame === 2) || stage === "Decode";

  return (
    <div className={[styles.panel, styles.pipeline].join(" ")}>
      <div className={styles.steps} aria-label="Request stages" role="group">
        {tabs.map((label) => (
          <button
            key={label}
            type="button"
            aria-pressed={label === stage}
            onClick={() => select(label)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.tokenRow} aria-label="Illustrative prompt tokens">
        {prompt.map((token, index) => (
          <motion.span
            key={token}
            className={styles.token}
            data-emphasis={stage === "Prefill" && frame === 0}
            animate={{ opacity: 1 }}
            initial={reduce ? false : { opacity: 0.5 }}
            transition={{
              duration: reduce ? 0 : 0.2,
              delay: reduce ? 0 : index * 0.04,
            }}
          >
            {token}
          </motion.span>
        ))}
      </div>

      <motion.div
        key={stage + frame}
        className={styles.operation}
        initial={enter}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
      >
        <h3>{title}</h3>
        <p className={styles.legend}>{description}</p>
        {stage === "Prefill" && frame === 0 && (
          <div
            className={styles.operationFlow}
            aria-label="Token IDs become embedding vectors, then enter the Transformer"
          >
            <span>Token IDs</span>
            <span>Embedding vectors</span>
            <span>Transformer layers</span>
          </div>
        )}
        {stage === "Prefill" && frame === 1 && (
          <div className={styles.attention}>
            <div
              className={styles.attentionGrid}
              role="img"
              aria-label="Causal attention matrix for five tokens. Each row can attend to tokens up to and including its own position. Every cell above the diagonal is masked."
            >
              {prompt.map((token, row) =>
                prompt.map((key, col) => (
                  <motion.span
                    key={token + key}
                    aria-hidden="true"
                    data-allowed={col <= row}
                    initial={reduce ? false : { opacity: 0.15 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: reduce ? 0 : 0.22,
                      delay: reduce ? 0 : row * 0.1,
                    }}
                  />
                )),
              )}
            </div>
            <p className={styles.legend}>
              Rows are queries and columns are key positions. Dark cells can be
              attended to. Dotted cells are masked.
            </p>
          </div>
        )}
        {((stage === "Prefill" && frame === 3) ||
          (stage === "Decode" && (frame < 2 || decodeStep === 2))) && (
          <div
            className={styles.operationFlow}
            aria-label="Final hidden state becomes vocabulary logits, then a sampled token"
          >
            <span>Final hidden state</span>
            <span>Vocabulary logits</span>
            <span>Sample a token</span>
          </div>
        )}
        {stage === "Decode" && decodeStep === 0 && (
          <p className={styles.frameDetail}>
            Input to this pass <strong>{answer[emitted - 1]}</strong>
          </p>
        )}
      </motion.div>

      {showCache && (
        <div
          className={styles.pipelineRow}
          aria-label="KV cache entries for one attention layer"
        >
          <strong>KV cache · one layer</strong>
          <div className={styles.tokenRow}>
            {cached.map((token, index) => (
              <motion.span
                key={index}
                className={styles.token}
                initial={enter}
                animate={{ opacity: 1, y: 0 }}
                transition={transition}
              >
                K/V {index + 1}
                <span className={styles.cacheToken}> {token}</span>
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {stage === "Decode" && (
        <div className={styles.pipelineRow}>
          <strong>Streamed output</strong>
          <div
            className={styles.tokenRow}
            aria-live="polite"
            aria-label="Streamed tokens"
          >
            {emitted === 0 && (
              <span className={styles.legend}>Waiting for the first token</span>
            )}
            {answer.slice(0, emitted).map((token) => (
              <motion.span
                key={token}
                className={styles.token}
                data-emphasis="true"
                initial={enter}
                animate={{ opacity: 1, y: 0 }}
                transition={transition}
              >
                {token}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {stage !== "Prompt" && (
        <div className={[styles.actions, styles.tokenActions].join(" ")}>
          <button
            type="button"
            disabled={frame === limit}
            onClick={() => setTarget(playing ? frame : limit)}
          >
            {playing ? "Pause" : "Play walkthrough"}
          </button>
          <button
            type="button"
            disabled={frame === limit}
            onClick={() => {
              setTarget(0);
              setFrame(frame + 1);
            }}
          >
            Next operation
          </button>
          {stage === "Decode" && (
            <button
              type="button"
              disabled={playing || frame === limit}
              onClick={nextToken}
            >
              Generate next token
            </button>
          )}
          <button type="button" onClick={() => select(stage)}>
            {stage === "Decode" ? "Reset decode" : "Reset prefill"}
          </button>
          <span className={styles.frameDetail} aria-live="polite">
            {stage === "Prefill"
              ? `Step ${frame + 1} of ${prefill.length}`
              : `${emitted} of ${answer.length} tokens`}
          </span>
        </div>
      )}
    </div>
  );
}
