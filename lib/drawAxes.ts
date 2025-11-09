export function drawAxes(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  padding: number = 40
) {
  ctx.save();
  ctx.strokeStyle = "#475569"; // slate-500
  ctx.lineWidth = 1;

  // Y axis (left)
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.stroke();

  // X axis (bottom)
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  ctx.restore();
}
export function drawAxisLabels(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  padding = 40,
  ticks = 5,
  minY = 0,
  maxY = 100
) {
  ctx.save();
  ctx.fillStyle = "#94a3b8"; // slate-400
  ctx.font = "10px monospace";
  ctx.textAlign = "right";

  // Y-axis ticks
  for (let i = 0; i <= ticks; i++) {
    const y = padding + (i * (height - padding * 2)) / ticks;
    const value = maxY - (i * (maxY - minY)) / ticks;

    ctx.fillText(value.toFixed(0), padding - 6, y + 3);
  }

  ctx.restore();
}
