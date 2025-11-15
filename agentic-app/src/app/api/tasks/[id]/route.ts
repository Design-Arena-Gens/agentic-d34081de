import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const paramsSchema = z.object({
  id: z.string(),
});

const updateSchema = z.object({
  status: z.enum(["PENDING", "SCHEDULED", "FAILED", "COMPLETED", "IN_PROGRESS"]).optional(),
  scheduledFor: z.string().datetime().nullable().optional(),
});

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const parsed = paramsSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const task = await prisma.videoTask.findUnique({
    where: { id: parsed.data.id },
    include: { result: true },
  });
  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ task });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const parsedParams = paramsSchema.safeParse(params);
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const body = await request.json();
  const parsedBody = updateSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      { error: parsedBody.error.flatten() },
      { status: 400 },
    );
  }

  const task = await prisma.videoTask.update({
    where: { id: parsedParams.data.id },
    data: {
      status: parsedBody.data.status ?? undefined,
      scheduledFor: parsedBody.data.scheduledFor
        ? new Date(parsedBody.data.scheduledFor)
        : parsedBody.data.scheduledFor === null
          ? null
          : undefined,
    },
  });

  return NextResponse.json({ task });
}
