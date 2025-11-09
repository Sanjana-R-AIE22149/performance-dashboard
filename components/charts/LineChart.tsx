// components/charts/LineChart.tsx
"use client";
import React, { useRef, useMemo, useState, useEffect } from "react";
import useChartRenderer from "@/hooks/useChartRenderer";
import { useDataContext } from "@/components/providers/DataProvider";

/**
 * LineChart reads a series buffer and draws:
 * - axes and ticks
 * - gridlines
 * - decimated line (sampled)
 * - hover tooltip and vertical crosshair (sync via hoverTimestamp in context)
 */

export default function LineChart({ seriesId, height = 300 }: { seriesId: string; height?: number; }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { buffers, hoverTimestamp, setHoverTimestamp, activeChart } = useDataContext();
  const [localHover, setLocalHover] = useState<{ x: number; y: number; t: number; v: number } | null>(null);

  const renderFn = useMemo(() => {
    return (ctx: CanvasRenderingContext2D, width: number, heightPx: number) => {
      ctx.clearRect(0, 0, width, heightPx);
      const margin = 36;
      const drawW = width - margin * 2;
      const drawH = heightPx - margin * 2;
      ctx.fillStyle = "#071028";
      ctx.fillRect(0, 0, width, heightPx);

      // draw title/legend
      const meta = buffers.get(seriesId);
      const color = meta?.color ?? "#34D399";
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "12px Inter, monospace";
      ctx.fillText(meta?.label ?? seriesId, margin, 18);

      if (!meta) {
        return;
      }
      const arr = meta.buffer;
      // find last non-zero timestamp
      let lastIdx = -2;
      for (let i = arr.length - 2; i >= 0; i -= 2) {
        if (arr[i] !== 0) {
          lastIdx = i;
          break;
        }
      }
      if (lastIdx < 0) return;
      const maxSamples = Math.max(500, Math.floor(drawW * 2));
      const times: number[] = [];
      const vals: number[] = [];
      let idx = lastIdx;
      let count = 0;
      while (idx >= 0 && count < maxSamples) {
        const t = arr[idx];
        const v = arr[idx + 1];
        times.push(t);
        vals.push(v);
        idx -= 2;
        count++;
      }
      times.reverse();
      vals.reverse();
      if (times.length < 2) return;

      const t0 = times[0], t1 = times[times.length - 1];
      let vmin = Number.POSITIVE_INFINITY, vmax = Number.NEGATIVE_INFINITY;
      for (let v of vals) {
        vmin = Math.min(vmin, v);
        vmax = Math.max(vmax, v);
      }
      if (!Number.isFinite(vmin) || !Number.isFinite(vmax)) return;
      if (vmin === vmax) { vmin -= 1; vmax += 1; }

      // draw gridlines + y ticks
      ctx.strokeStyle = "#0f1724";
      ctx.lineWidth = 1;
      const ySteps = 4;
      ctx.fillStyle = "#9ca3af";
      ctx.font = "11px Inter, monospace";
      for (let i = 0; i <= ySteps; i++) {
        const y = margin + (drawH * i) / ySteps;
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
        const val = (vmax - (vmax - vmin) * (i / ySteps));
        ctx.fillText(val.toFixed(2), 4, y + 4);
      }

      // draw line (decimated to canvas width)
      ctx.beginPath();
      let prevX = -1, prevY = -1;
      const n = times.length;
      const stride = Math.max(1, Math.floor(n / Math.max(1, Math.floor(drawW))));
      for (let i = 0; i < n; i += stride) {
        const t = times[i];
        const v = vals[i];
        const x = margin + ((t - t0) / (t1 - t0 || 1)) * drawW;
        const y = margin + drawH - ((v - vmin) / (vmax - vmin)) * drawH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        prevX = x; prevY = y;
      }
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = color;
      ctx.stroke();

      // draw hover crosshair if present
      const hoverTs = hoverTimestamp;
      if (hoverTs) {
        if (hoverTs >= t0 && hoverTs <= t1) {
          const hx = margin + ((hoverTs - t0) / (t1 - t0 || 1)) * drawW;
          ctx.beginPath();
          ctx.moveTo(hx, margin);
          ctx.lineTo(hx, margin + drawH);
          ctx.strokeStyle = "#94a3b8";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // local tooltip drawing when user hovers this particular chart
      if (localHover) {
        ctx.fillStyle = "#000000cc";
        const tooltipW = 120;
        const tooltipH = 42;
        const tx = Math.min(width - tooltipW - 8, Math.max(8, localHover.x + 8));
        const ty = Math.max(8, localHover.y - tooltipH - 8);
        ctx.fillRect(tx, ty, tooltipW, tooltipH);
        ctx.fillStyle = "#fff";
        ctx.fillText(`t: ${new Date(localHover.t).toLocaleTimeString()}`, tx + 8, ty + 14);
        ctx.fillText(`v: ${localHover.v.toFixed(3)}`, tx + 8, ty + 30);
      }
    };
  }, [buffers, seriesId, hoverTimestamp, localHover]);

  // attach renderer
  useChartRenderer(canvasRef, renderFn, [buffers, seriesId, hoverTimestamp, activeChart]);

  // mouse events for tooltip
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = () => canvas.getBoundingClientRect();
    function onMove(e: MouseEvent) {
      const r = rect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      // determine hovered timestamp from X
      const meta = buffers.get(seriesId);
      if (!meta) return;
      const arr = meta.buffer;
      // find last timestamps as in renderFn
      let lastIdx = -2;
      for (let i = arr.length - 2; i >= 0; i -= 2) {
        if (arr[i] !== 0) { lastIdx = i; break; }
      }
      if (lastIdx < 0) return;
      const times: number[] = [];
      const vals: number[] = [];
      let idx = lastIdx;
      let count = 0;
      const maxSamples = 2000;
      while (idx >= 0 && count < maxSamples) {
        times.push(arr[idx]);
        vals.push(arr[idx + 1]);
        idx -= 2; count++;
      }
      times.reverse(); vals.reverse();
      if (times.length < 2) return;
      const t0 = times[0], t1 = times[times.length - 1];
      const margin = 36;
      const drawW = (canvas.width / (window.devicePixelRatio || 1)) - margin * 2;
      const rel = Math.max(0, Math.min(1, (x - margin) / drawW));
      const ts = t0 + rel * (t1 - t0);
      // find nearest index
      let nearestI = 0, mind = Infinity;
      for (let i = 0; i < times.length; i++) {
        const d = Math.abs(times[i] - ts);
        if (d < mind) { mind = d; nearestI = i; }
      }
      setLocalHover({ x, y, t: times[nearestI], v: vals[nearestI] });
      // broadcast hover timestamp to context (so other charts draw crosshair)
      setHoverTimestamp(times[nearestI]);
    }
    function onLeave() {
      setLocalHover(null);
      setHoverTimestamp(null);
    }
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [buffers, seriesId, setHoverTimestamp]);

  return (
    <div style={{ height }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block", borderRadius: 8, boxShadow: activeChart === seriesId ? "0 8px 30px rgba(52,211,153,0.12)" : undefined }} />
    </div>
  );
}
