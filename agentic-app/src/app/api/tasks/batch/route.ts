import { NextResponse } from "next/server";
import { z } from "zod";
import { createBatchTasks } from "@/lib/agent/pipeline";

const batchSchema = z.object({
  count: z.number().min(1).max(20),
  niche: z.string().optional(),
  scheduledFor: z.string().datetime().optional(),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = batchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const tasks = await createBatchTasks({
    count: parsed.data.count,
    niche: parsed.data.niche,
    scheduled: parsed.data.scheduledFor
      ? new Date(parsed.data.scheduledFor)
      : undefined,
  });
  return NextResponse.json({ tasks }, { status: 201 });
}
