"use client";

import { useEffect, useRef, useState } from "react";

export function usePerformanceMonitor() {
  const [fps, setFps] = useState<number>(60);
  const [heap, setHeap] = useState<number | null>(null);

  const frames = useRef(0);
  const last = useRef(performance.now());
  const lastFpsUpdate = useRef(performance.now());

  useEffect(() => {
    let active = true;

    const loop = () => {
      if (!active) return;

      const now = performance.now();
      frames.current++;

      if (now - lastFpsUpdate.current >= 500) {
        const delta = now - last.current;
        const current = (frames.current * 1000) / delta;

        setFps(Math.round(current));

        last.current = now;
        frames.current = 0;
        lastFpsUpdate.current = now;
      }

      // Chrome-only
      const mem = (performance as any).memory;
      if (mem) {
        setHeap(Math.round((mem.usedJSHeapSize / 1048576) * 100) / 100);
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    return () => {
      active = false;
    };
  }, []);

  return { fps, heap };
}
