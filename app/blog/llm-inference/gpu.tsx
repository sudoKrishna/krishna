"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  drawGraphicsCard,
  gpuPartKeys,
  gpuParts,
  isInternal,
  type GpuPart,
} from "./scenes";
import { useCanvas } from "./use-canvas";
import { timing, tween } from "./motion-settings";
import styles from "./article.module.css";

const initialYaw = -0.46;
const initialPitch = 0.81;
const spring = { stiffness: 260, damping: 32, mass: 0.65 };
const partLabels: Record<GpuPart, string> = {
  fans: "Fans",
  heatsink: "Heatsink",
  power: "Power",
  compute: "GPU die",
  vram: "VRAM",
  host: "PCIe",
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function GpuExplorer() {
  const [selected, setSelected] = useState<GpuPart>("fans");
  const [hovered, setHovered] = useState<GpuPart | null>(null);
  const [focused, setFocused] = useState<GpuPart | null>(null);
  const active = hovered ?? focused ?? selected;
  const exploded = isInternal(selected);
  const reduce = useReducedMotion();
  const yawTarget = useMotionValue(initialYaw);
  const pitchTarget = useMotionValue(initialPitch);
  const yaw = useSpring(yawTarget, spring);
  const pitch = useSpring(pitchTarget, spring);
  const split = useMotionValue(0);
  const hotspots = useRef<Partial<Record<GpuPart, HTMLButtonElement | null>>>(
    {},
  );
  const drag = useRef<{
    x: number;
    y: number;
    t: number;
    vx: number;
    vy: number;
  } | null>(null);

  const { canvas, redraw } = useCanvas((ctx, width, height) => {
    const project = drawGraphicsCard(
      ctx,
      width,
      height,
      reduce ? yawTarget.get() : yaw.get(),
      reduce ? pitchTarget.get() : pitch.get(),
      clamp(split.get(), 0, 1),
      active,
    );
    for (const part of gpuPartKeys) {
      const button = hotspots.current[part];
      if (!button) continue;
      const [x, y] = project(part);
      button.style.translate = `${x}px ${y}px`;
    }
  });

  useMotionValueEvent(yaw, "change", redraw);
  useMotionValueEvent(pitch, "change", redraw);
  useMotionValueEvent(split, "change", redraw);

  useEffect(() => {
    const target = exploded ? 1 : 0;
    if (reduce) {
      split.jump(target);
      return;
    }
    const animation = animate(split, target, tween(reduce, timing.reveal));
    return () => animation.stop();
  }, [exploded, reduce, split]);

  function setAngle(nextYaw: number, nextPitch: number) {
    yawTarget.set(nextYaw);
    pitchTarget.set(nextPitch);
    if (reduce) redraw();
  }

  function select(part: GpuPart) {
    setSelected(part);
    setHovered(null);
    setFocused(null);
  }

  function beginDrag(event: PointerEvent<HTMLCanvasElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      t: event.timeStamp,
      vx: 0,
      vy: 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLCanvasElement>) {
    if (!event.isPrimary || !drag.current) return;
    const { x, y, t, vx, vy } = drag.current;
    const dt = Math.max(8, event.timeStamp - t);
    setAngle(
      clamp(yawTarget.get() + (event.clientX - x) * 0.01, -1.15, 1.12),
      clamp(pitchTarget.get() + (event.clientY - y) * 0.006, 0.54, 1.2),
    );
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      t: event.timeStamp,
      vx: 0.35 * vx + (0.65 * (event.clientX - x)) / dt,
      vy: 0.35 * vy + (0.65 * (event.clientY - y)) / dt,
    };
  }

  function releaseDrag(event: PointerEvent<HTMLCanvasElement>) {
    const last = drag.current;
    drag.current = null;
    if (!last || reduce || event.timeStamp - last.t > 90) return;
    setAngle(
      clamp(yawTarget.get() + clamp(last.vx * 0.7, -0.35, 0.35), -1.15, 1.12),
      clamp(pitchTarget.get() + clamp(last.vy * 0.42, -0.16, 0.16), 0.54, 1.2),
    );
  }

  function inspect(part: GpuPart) {
    return {
      onPointerEnter: (event: PointerEvent<HTMLButtonElement>) => {
        if (event.pointerType !== "touch") setHovered(part);
      },
      onPointerLeave: () => setHovered(null),
      onFocus: () => setFocused(part),
      onBlur: () => setFocused(null),
      onClick: () => select(part),
    };
  }

  return (
    <figure className={styles.plate}>
      <div className={styles.plateBar}>
        <h3>Inside a graphics card</h3>
        <div className={styles.controls} aria-label="GPU view" role="group">
          <button
            type="button"
            aria-pressed={!exploded}
            onClick={() => select("fans")}
          >
            Assembled
          </button>
          <button
            type="button"
            aria-pressed={exploded}
            onClick={() => select("compute")}
          >
            Exploded
          </button>
          <button
            type="button"
            aria-label="Rotate GPU"
            onClick={() =>
              setAngle(
                yawTarget.get() > 0.8 ? -1.12 : yawTarget.get() + 0.46,
                pitchTarget.get(),
              )
            }
          >
            Rotate
          </button>
          <button
            type="button"
            onClick={() => {
              setAngle(initialYaw, initialPitch);
              select("fans");
            }}
          >
            Reset view
          </button>
        </div>
      </div>
      <div className={styles.stage}>
        <canvas
          ref={canvas}
          className={styles.gpuCanvas}
          role="img"
          aria-label="Rotatable RTX-style graphics card with an exploded view of the circuit board"
          onPointerDown={beginDrag}
          onPointerMove={moveDrag}
          onPointerUp={releaseDrag}
          onLostPointerCapture={() => {
            drag.current = null;
          }}
        >
          Select a part below for its description.
        </canvas>
        <AnimatePresence initial={false}>
          {gpuPartKeys
            .filter((part) => isInternal(part) === exploded)
            .map((part) => (
              <motion.button
                key={part}
                ref={(button) => {
                  hotspots.current[part] = button;
                }}
                className={styles.hotspot}
                data-label={gpuParts[part].title}
                data-active={part === active}
                type="button"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={tween(reduce)}
                aria-label={"Inspect " + partLabels[part]}
                {...inspect(part)}
              />
            ))}
        </AnimatePresence>
        <span className={styles.modelHint} aria-hidden="true">
          Drag to rotate · Select a point to inspect
        </span>
      </div>
      <figcaption>
        <div
          className={styles.controls}
          aria-label="Graphics card parts"
          role="group"
        >
          {gpuPartKeys.map((part) => (
            <button
              key={part}
              type="button"
              aria-pressed={part === selected}
              {...inspect(part)}
            >
              {partLabels[part]}
            </button>
          ))}
        </div>
        <div className={styles.partCopy} aria-live="polite">
          <AnimatePresence initial={false}>
            <motion.div
              className={styles.partDescription}
              key={active}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={tween(reduce)}
            >
              <strong>{gpuParts[active].title}</strong>
              <p>{gpuParts[active].note}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </figcaption>
    </figure>
  );
}
