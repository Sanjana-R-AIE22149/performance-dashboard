// components/charts/Heatmap.tsx
"use client";
import React, { useRef, useMemo } from "react";
import useChartRenderer from "@/hooks/useChartRenderer";
import { useDataContext } from "@/components/providers/DataProvider";

function colorForValue(v: number, min: number, max: number) {
  const ratio = (v - min) / (max - min || 1);
  const r = Math.floor(255 * Math.max(0, Math.min(1, ratio)));
  const g = Math.floor(255 * (1 - Math.abs(ratio - 0.5) * 2));
  const b = 150;
  return `rgb(${r}, ${g}, ${b})`;
}

export default function Heatmap({ seriesId, height = 300 }: { seriesId: string; height?: number }) {
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
      // build a histogram per bucket (vertical axis represents value bins)
      const bucketsX = 80, bucketsY = 40;
      const grid = new Array(bucketsY).fill(0).map(() => new Array(bucketsX).fill(0));
      const times: number[] = [], vals: number[] = [];
      let idx = lastIdx, count = 0;
      while (idx >= 0 && count < 3000) { times.push(arr[idx]); vals.push(arr[idx + 1]); idx -= 2; count++; }
      if (times.length < 2) return;
      times.reverse(); vals.reverse();
      const t0 = times[0], t1 = times[times.length - 1];
      const vmin = Math.min(...vals), vmax = Math.max(...vals);
      for (let i = 0; i < times.length; i++) {
        const x = Math.floor(((times[i] - t0) / (t1 - t0 || 1)) * (bucketsX - 1));
        const y = Math.floor(((vals[i] - vmin) / (vmax - vmin || 1)) * (bucketsY - 1));
        if (x >= 0 && x < bucketsX && y >= 0 && y < bucketsY) {
          grid[bucketsY - 1 - y][x] += 1; // invert y so 0 at top
        }
      }
      const margin = 6;
      const drawW = width - margin * 2;
      const drawH = heightPx - margin * 2;
      const cellW = drawW / bucketsX;
      const cellH = drawH / bucketsY;
      // find max
      let maxc = 1;
      for (let r of grid) for (let c of r) if (c > maxc) maxc = c;
      for (let ry = 0; ry < bucketsY; ry++) {
        for (let rx = 0; rx < bucketsX; rx++) {
          const v = grid[ry][rx];
          const col = colorForValue(v, 0, maxc);
          ctx.fillStyle = col;
          ctx.fillRect(margin + rx * cellW, margin + ry * cellH, Math.ceil(cellW), Math.ceil(cellH));
        }
      }
    };
  }, [buffers, seriesId]);

  useChartRenderer(canvasRef, renderFn, [buffers, seriesId]);
  return <div style={{ height }}><canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} /></div>;
}