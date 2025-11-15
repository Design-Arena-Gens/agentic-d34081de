import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ensureDefaultChannel } from "@/lib/services/channel";

const createTaskSchema = z.object({
  topic: z.string().min(3),
  niche: z.string().optional(),
  scheduledFor: z.string().datetime().optional(),
});

export const dynamic = "force-dynamic";

export async function GET() {
  const tasks = await prisma.videoTask.findMany({
    include: {
      result: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ tasks });
}

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = createTaskSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const channel = await ensureDefaultChannel();
  const task = await prisma.videoTask.create({
    data: {
      channelId: channel.id,
      topic: parsed.data.topic,
      niche: parsed.data.niche ?? channel.niche,
      scheduledFor: parsed.data.scheduledFor
        ? new Date(parsed.data.scheduledFor)
        : undefined,
      status: parsed.data.scheduledFor ? "SCHEDULED" : "PENDING",
    },
  });

  return NextResponse.json({ task }, { status: 201 });
}
