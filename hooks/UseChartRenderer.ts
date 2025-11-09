"use client";
import { useEffect, useRef } from "react";

export default function useChartRenderer(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  renderFn: (ctx: CanvasRenderingContext2D, width: number, height: number) => void,
  deps: any[] = []
) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);

      canvas.width = w * dpr;
      canvas.height = h * dpr;

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    let active = true;

    const loop = () => {
      if (!active) return;

      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      renderFn(ctx, width, height);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, deps);
}
