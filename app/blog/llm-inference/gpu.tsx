"use client";

import {
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
  const split = useSpring(0, spring);
  const hotspots = useRef<Partial<Record<GpuPart, HTMLButtonElement | null>>>(
    {},
  );
  const drag = useRef<{ x: number; y: number } | null>(null);

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
      button.style.left = x + "px";
      button.style.top = y + "px";
    }
  });

  useMotionValueEvent(yaw, "change", redraw);
  useMotionValueEvent(pitch, "change", redraw);
  useMotionValueEvent(split, "change", redraw);

  useEffect(() => {
    const target = exploded ? 1 : 0;
    if (reduce) split.jump(target);
    else split.set(target);
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
    drag.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLCanvasElement>) {
    if (!event.isPrimary || !drag.current) return;
    const { x, y } = drag.current;
    setAngle(
      clamp(yawTarget.get() + (event.clientX - x) * 0.01, -1.15, 1.12),
      clamp(pitchTarget.get() + (event.clientY - y) * 0.006, 0.54, 1.2),
    );
    drag.current = { x: event.clientX, y: event.clientY };
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
          onLostPointerCapture={() => {
            drag.current = null;
          }}
        >
          Select a part below for its description.
        </canvas>
        {gpuPartKeys.map((part) => (
          <button
            key={part}
            ref={(button) => {
              hotspots.current[part] = button;
            }}
            className={styles.hotspot}
            data-label={gpuParts[part].title}
            data-active={part === active}
            type="button"
            hidden={isInternal(part) !== exploded}
            aria-label={"Inspect " + partLabels[part]}
            {...inspect(part)}
          />
        ))}
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
          <motion.strong
            key={active}
            initial={reduce ? false : { opacity: 0.65, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
          >
            {gpuParts[active].title}
          </motion.strong>
          <p>{gpuParts[active].note}</p>
        </div>
      </figcaption>
    </figure>
  );
}
