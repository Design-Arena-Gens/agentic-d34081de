import { NextResponse } from "next/server";
import { refreshAnalytics } from "@/lib/agent/pipeline";

export async function POST() {
  await refreshAnalytics();
  return NextResponse.json({ status: "ok" });
}
