"use client";

import { useEffect, useRef } from "react";

export default function Sparkline({
  data,
  color = "#22d3ee", // cyan
  width = 120,
  height = 30,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext("2d")!;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const max = Math.max(...data);
    const min = Math.min(...data);

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    ctx.beginPath();

    data.forEach((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / (max - min || 1)) * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
  }, [data]);

  return <canvas ref={ref} style={{ display: "block" }} />;
}
