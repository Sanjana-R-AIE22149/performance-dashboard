// components/charts/BarChart.tsx
"use client";
import React, { useRef, useMemo } from "react";
import useChartRenderer from "@/hooks/useChartRenderer";
import { useDataContext } from "@/components/providers/DataProvider";

export default function BarChart({ seriesId, height = 300 }: { seriesId: string; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { buffers } = useDataContext();

  const renderFn = useMemo(() => {
    return (ctx: CanvasRenderingContext2D, width: number, heightPx: number) => {
      ctx.clearRect(0, 0, width, heightPx);
      const meta = buffers.get(seriesId);
      ctx.fillStyle = "#071028";
      ctx.fillRect(0, 0, width, heightPx);
      if (!meta) return;
      const arr = meta.buffer;
      // quick reduce: compute buckets across last N points
      let lastIdx = -2;
      for (let i = arr.length - 2; i >= 0; i -= 2) { if (arr[i] !== 0) { lastIdx = i; break; } }
      if (lastIdx < 0) return;
      const buckets = 60;
      const counts = new Array(buckets).fill(0);
      const times: number[] = [];
      let idx = lastIdx;
      let count = 0;
      while (idx >= 0 && count < 2000) {
        times.push(arr[idx]); idx -= 2; count++;
      }
      if (times.length === 0) return;
      times.reverse();
      const t0 = times[0], t1 = times[times.length - 1];
      for (let t of times) {
        const p = Math.floor(((t - t0) / (t1 - t0 || 1)) * buckets);
        counts[Math.max(0, Math.min(buckets - 1, p))]++;
      }
      const margin = 24;
      const drawW = width - margin * 2;
      const drawH = heightPx - margin * 2;
      const barW = drawW / buckets;
      let maxc = Math.max(...counts, 1);
      ctx.fillStyle = meta.color ?? "#3B82F6";
      for (let i = 0; i < buckets; i++) {
        const h = (counts[i] / maxc) * drawH;
        ctx.fillRect(margin + i * barW + 1, margin + drawH - h, barW - 2, h);
      }
    };
  }, [buffers, seriesId]);

  useChartRenderer(canvasRef, renderFn, [buffers, seriesId]);
  return <div style={{ height }}><canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} /></div>;
}