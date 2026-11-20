"use client";

import { useCallback, useEffect, useRef } from "react";

type Draw = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
) => void;

export function useCanvas(draw: Draw) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const render = useRef(draw);

  const redraw = useCallback(() => {
    const element = canvas.current;
    const ctx = element?.getContext("2d");
    if (!element || !ctx) return;
    const { width, height } = element.getBoundingClientRect();
    if (!width || !height) return;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    const pixelsWide = Math.round(width * scale);
    const pixelsHigh = Math.round(height * scale);
    if (element.width !== pixelsWide || element.height !== pixelsHigh) {
      element.width = pixelsWide;
      element.height = pixelsHigh;
    }
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, width, height);
    render.current(ctx, width, height);
  }, []);

  useEffect(() => {
    render.current = draw;
    redraw();
  }, [draw, redraw]);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const observer = new ResizeObserver(redraw);
    observer.observe(element);
    return () => observer.disconnect();
  }, [redraw]);

  return { canvas, redraw };
}
