// app/api/data/route.ts
import { NextResponse } from "next/server";
import generateInitialDataset from "@/lib/dataGenerator";

export async function GET() {
  const payload = await generateInitialDataset({ seriesCount: 4, pointsPerSeries: 5000, intervalMs: 100 });
  return NextResponse.json(payload);
}
