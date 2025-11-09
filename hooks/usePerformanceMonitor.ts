"use client";

import { useEffect, useRef, useState } from "react";

export function usePerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const [heap, setHeap] = useState<number | null>(null);
  const [cpu, setCpu] = useState(0);
  const [latency, setLatency] = useState(0);

  const frames = useRef(0);
  const lastFrame = useRef(performance.now());
  const lastFpsUpdate = useRef(performance.now());

  const fpsHistory = useRef<number[]>([]);
  const memHistory = useRef<number[]>([]);
  const cpuHistory = useRef<number[]>([]);
  const latencyHistory = useRef<number[]>([]);
  const renderHistory = useRef<number[]>([]);

  useEffect(() => {
    let active = true;

    const loop = () => {
      if (!active) return;

      const now = performance.now();
      frames.current++;

      const frameTime = now - lastFrame.current;
      renderHistory.current.push(frameTime);
      if (renderHistory.current.length > 60) renderHistory.current.shift();

      const cpuEstimate = Math.min(100, (frameTime / 16.6) * 100);
      setCpu(cpuEstimate);
      cpuHistory.current.push(cpuEstimate);
      if (cpuHistory.current.length > 60) cpuHistory.current.shift();

      if (now - lastFpsUpdate.current >= 500) {
        const delta = now - lastFrame.current;
        const currentFps = (frames.current * 1000) / delta;

        const rounded = Math.round(currentFps);
        setFps(rounded);

        fpsHistory.current.push(rounded);
        if (fpsHistory.current.length > 60) fpsHistory.current.shift();

        frames.current = 0;
        lastFrame.current = now;
        lastFpsUpdate.current = now;
      }

      const mem = (performance as any).memory;
      if (mem) {
        const used = mem.usedJSHeapSize / 1048576;
        const rounded = Math.round(used * 100) / 100;
        setHeap(rounded);

        memHistory.current.push(rounded);
        if (memHistory.current.length > 60) memHistory.current.shift();
      }

      const fakeLatency = Math.random() * 8 + 2;
      setLatency(fakeLatency);
      latencyHistory.current.push(fakeLatency);
      if (latencyHistory.current.length > 60) latencyHistory.current.shift();

      lastFrame.current = now;
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    return () => {
      active = false;
    };
  }, []);

  return {
    fps,
    heap,
    cpu,
    latency,
    fpsHistory: fpsHistory.current,
    memHistory: memHistory.current,
    cpuHistory: cpuHistory.current,
    latencyHistory: latencyHistory.current,
    renderHistory: renderHistory.current,
  };
}
