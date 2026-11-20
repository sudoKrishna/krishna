"use client";

import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { drawTransformer } from "./scenes";
import {
  layerCount,
  movieLength,
  sceneStarts,
  transformerScenes,
} from "./transformer-script";
import { useCanvas } from "./use-canvas";
import styles from "./article.module.css";

function getFrame(seconds: number) {
  const index = Math.max(
    0,
    sceneStarts.findLastIndex((start) => start <= seconds),
  );
  const scene = transformerScenes[index];
  const phase = Math.min(1, (seconds - sceneStarts[index]) / scene.seconds);
  const layer =
    scene.visual === "stack"
      ? Math.min(layerCount, Math.floor(phase * layerCount) + 1)
      : scene.visual === "output"
        ? layerCount
        : 1;
  return { index, scene, phase, layer };
}

export function TransformerMovie() {
  const time = useMotionValue(0);
  const reduce = useReducedMotion();
  const [seconds, setSeconds] = useState(0);
  const [playing, setPlaying] = useState(false);
  const playback = useRef<ReturnType<typeof animate> | null>(null);
  const { index, scene, layer } = getFrame(seconds);
  const { canvas, redraw } = useCanvas((ctx, width, height) => {
    const frame = getFrame(time.get());
    drawTransformer(
      ctx,
      width,
      height,
      frame.layer,
      frame.scene,
      reduce ? 0.6 : frame.phase,
    );
  });

  useMotionValueEvent(time, "change", (value) => {
    setSeconds(Math.min(movieLength, Math.round(value * 4) / 4));
    redraw();
  });
  useEffect(() => () => playback.current?.stop(), []);

  function pause() {
    playback.current?.stop();
    setPlaying(false);
  }

  function seek(value: number) {
    pause();
    time.jump(value);
    setSeconds(value);
  }

  function toggle() {
    if (playing) {
      pause();
      return;
    }
    const start = time.get() >= movieLength ? 0 : time.get();
    time.jump(start);
    setPlaying(true);
    playback.current = animate(time, movieLength, {
      duration: movieLength - start,
      ease: "linear",
      onComplete: () => setPlaying(false),
    });
  }

  return (
    <div className={styles.movie}>
      <div className={styles.movieStage} data-phase={scene.phase}>
        <div className={styles.movieHud}>
          <span>{scene.phase}</span>
          <span>
            Layer {String(layer).padStart(2, "0")} / {layerCount}
          </span>
        </div>
        <canvas
          ref={canvas}
          role="img"
          aria-label="3D stack of 32 Transformer layers with moving hidden states and per-layer key-value cache"
        />
        <div className={styles.movieLegend}>
          <span>
            {scene.phase === "Prefill"
              ? "Prompt positions"
              : "Current position"}
          </span>
          <span>Per-layer KV</span>
        </div>
      </div>
      <div className={styles.movieControls}>
        <label>
          Timeline
          <input
            type="range"
            min={0}
            max={movieLength}
            step={0.25}
            value={seconds}
            onChange={(event) => seek(Number(event.target.value))}
          />
        </label>
        <div className={styles.actions}>
          <button type="button" onClick={toggle}>
            {playing
              ? "Pause movie"
              : seconds >= movieLength
                ? "Replay movie"
                : "Play movie"}
          </button>
          <button
            type="button"
            disabled={index === 0}
            onClick={() => seek(sceneStarts[index - 1])}
          >
            Previous scene
          </button>
          <button
            type="button"
            disabled={index === transformerScenes.length - 1}
            onClick={() => seek(sceneStarts[index + 1])}
          >
            Next scene
          </button>
        </div>
        <ol className={styles.sceneButtons} aria-label="Movie scenes">
          {transformerScenes.map((entry, position) => (
            <li key={entry.title}>
              <button
                type="button"
                aria-label={entry.title}
                aria-current={position === index ? "step" : undefined}
                onClick={() => seek(sceneStarts[position])}
              >
                {String(position + 1).padStart(2, "0")}
              </button>
            </li>
          ))}
        </ol>
        <div
          className={styles.sceneCopy}
          aria-live={playing ? "off" : "polite"}
        >
          <h3>{scene.title}</h3>
          <p>{scene.detail}</p>
        </div>
      </div>
    </div>
  );
}
