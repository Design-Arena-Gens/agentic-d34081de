import { ManualTaskForm } from "@/components/ManualTaskForm";
import { TasksTable } from "@/components/TasksTable";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const getTasks = async () => {
  const tasks = await prisma.videoTask.findMany({
    include: { result: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return tasks.map((task) => ({
    id: task.id,
    topic: task.topic,
    niche: task.niche,
    status: task.status,
    failureReason: task.failureReason,
    createdAt: task.createdAt.toISOString(),
    scheduledFor: task.scheduledFor?.toISOString() ?? null,
    result: task.result
      ? {
          youtubeVideoId: task.result.youtubeVideoId,
        }
      : null,
  }));
};

export default async function TasksPage() {
  const tasks = await getTasks();
  return (
    <div className="flex flex-col gap-8 px-6 py-10 lg:px-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-slate-50">Task manager</h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Review and manage every Short in the queue. Prioritize, reschedule, or
          craft bespoke ideas without touching the editing timeline.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <ManualTaskForm defaultNiche={env.DEFAULT_NICHE ?? "INSERT NICHE HERE"} />
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg text-sm text-slate-300 space-y-3">
          <h3 className="text-lg font-semibold text-slate-50">
            Automation tips
          </h3>
          <ul className="space-y-3 list-disc pl-5 marker:text-slate-500">
            <li>
              Use specific trending keywords or hooks to guide AI storytelling
              direction.
            </li>
            <li>
              Schedule tasks to drip publish throughout the day for consistent
              growth.
            </li>
            <li>
              Failed tasks log stack traces here - adjust the prompt and retry.
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">
          All queued Shorts
        </h2>
        <TasksTable tasks={tasks} />
      </section>
    </div>
  );
}
