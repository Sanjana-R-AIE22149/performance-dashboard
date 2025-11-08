import { NextResponse } from "next/server";

export async function GET() {
  // Minimal valid API route
  return NextResponse.json({ message: "API working" });
}
