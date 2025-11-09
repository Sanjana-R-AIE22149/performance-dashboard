// components/charts/ScatterPlot.tsx
"use client";
import React, { useRef, useMemo } from "react";
import useChartRenderer from "@/hooks/useChartRenderer";
import { useDataContext } from "@/components/providers/DataProvider";

export default function ScatterPlot({ seriesId, height = 300 }: { seriesId: string; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { buffers } = useDataContext();

  const renderFn = useMemo(() => {
    return (ctx: CanvasRenderingContext2D, width: number, heightPx: number) => {
      ctx.clearRect(0, 0, width, heightPx);
      ctx.fillStyle = "#071028";
      ctx.fillRect(0, 0, width, heightPx);
      const meta = buffers.get(seriesId);
      if (!meta) return;
      const arr = meta.buffer;
      let lastIdx = -2;
      for (let i = arr.length - 2; i >= 0; i -= 2) { if (arr[i] !== 0) { lastIdx = i; break; } }
      if (lastIdx < 0) return;
      const times: number[] = [], vals: number[] = [];
      let idx = lastIdx, count = 0;
      while (idx >= 0 && count < 2000) { times.push(arr[idx]); vals.push(arr[idx + 1]); idx -= 2; count++; }
      if (times.length < 2) return;
      times.reverse(); vals.reverse();
      const t0 = times[0], t1 = times[times.length - 1];
      let vmin = Math.min(...vals), vmax = Math.max(...vals);
      if (vmin === vmax) { vmin -= 1; vmax += 1; }
      const margin = 24;
      const drawW = width - margin * 2;
      const drawH = heightPx - margin * 2;
      ctx.fillStyle = meta.color ?? "#F59E0B";
      for (let i = 0; i < times.length; i++) {
        const x = margin + ((times[i] - t0) / (t1 - t0 || 1)) * drawW;
        const y = margin + drawH - ((vals[i] - vmin) / (vmax - vmin)) * drawH;
        ctx.beginPath();
        ctx.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };
  }, [buffers, seriesId]);

  useChartRenderer(canvasRef, renderFn, [buffers, seriesId]);
  return <div style={{ height }}><canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} /></div>;
}
