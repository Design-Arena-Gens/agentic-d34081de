import { NextResponse } from "next/server";
import { runAgentCycle } from "@/lib/agent/pipeline";

export const maxDuration = 300;

export async function POST() {
  const results = await runAgentCycle();
  return NextResponse.json({ results });
}
