"use client";
import { useEffect, useRef } from "react";

export default function LineChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#222";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      for (let i = 0; i < 10000; i++) {
        const x = (i / 10000) * canvas.width;
        const y = canvas.height / 2 + Math.sin(i / 50 + frame / 20) * 50;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      frame++;
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      style={{ border: "1px solid #ccc", width: "100%" }}
    />
  );
}
