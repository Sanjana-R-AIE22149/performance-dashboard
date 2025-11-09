import { InitialData } from "./types";

export default async function generateInitialDataset(opts?: {
  seriesCount?: number;
  pointsPerSeries?: number;
  intervalMs?: number;
}): Promise<InitialData> {
  const seriesCount = opts?.seriesCount ?? 4;
  const pointsPerSeries = opts?.pointsPerSeries ?? 10000;
  const intervalMs = opts?.intervalMs ?? 100;
  const now = Date.now();

  const series = Array.from({ length: seriesCount }, (_, s) => {
    const color = ["#34D399", "#3B82F6", "#F59E0B", "#EF4444"][s % 4];
    const pts = [];
    let base = Math.random() * 100;
    let trend = (Math.random() - 0.5) * 0.05;
    for (let i = 0; i < pointsPerSeries; i++) {
      const t = now - (pointsPerSeries - i) * intervalMs;
      base += trend + (Math.random() - 0.5) * 0.8;
      const sine = Math.sin((t / (1000 + 300 * s)) * Math.PI * 2) * (10 + s * 5);
      const spike = Math.random() < 0.001 ? (Math.random() - 0.5) * 50 : 0;
      pts.push({ t, v: base + sine + spike });
    }
    return { id: `series-${s}`, label: `Series ${s + 1}`, color, points: pts };
  });

  return { series };
}
