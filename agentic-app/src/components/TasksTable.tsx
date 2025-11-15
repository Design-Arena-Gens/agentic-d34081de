"use client";

import { formatDistanceToNow } from "date-fns";

type TasksTableProps = {
  tasks: {
    id: string;
    topic: string;
    niche: string;
    status: "PENDING" | "IN_PROGRESS" | "FAILED" | "COMPLETED" | "SCHEDULED";
    failureReason: string | null;
    scheduledFor: string | null;
    createdAt: string;
    result: {
      youtubeVideoId: string | null;
    } | null;
  }[];
};

const statusColor = (
  status: TasksTableProps["tasks"][number]["status"],
) => {
  switch (status) {
    case "COMPLETED":
      return "text-emerald-400";
    case "FAILED":
      return "text-rose-400";
    case "IN_PROGRESS":
      return "text-amber-300";
    case "SCHEDULED":
      return "text-sky-300";
    default:
      return "text-slate-300";
  }
};

export function TasksTable({ tasks }: TasksTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
      <table className="min-w-full divide-y divide-slate-800">
        <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Topic</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Scheduled</th>
            <th className="px-4 py-3 text-left font-medium">Created</th>
            <th className="px-4 py-3 text-left font-medium">YouTube ID</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-sm text-slate-200">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-slate-900/60">
              <td className="px-4 py-3">
                <div className="font-medium text-slate-100">{task.topic}</div>
                <div className="text-xs text-slate-400">{task.niche}</div>
              </td>
              <td className={`px-4 py-3 font-medium ${statusColor(task.status)}`}>
                {task.status}
                {task.failureReason && (
                  <div className="text-xs text-rose-300">
                    {task.failureReason}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                {task.scheduledFor
                  ? formatDistanceToNow(new Date(task.scheduledFor), {
                      addSuffix: true,
                    })
                  : "-"}
              </td>
              <td className="px-4 py-3 text-slate-400">
                {formatDistanceToNow(new Date(task.createdAt), {
                  addSuffix: true,
                })}
              </td>
              <td className="px-4 py-3 text-xs text-slate-400">
                {task.result?.youtubeVideoId ?? "-"}
              </td>
            </tr>
          ))}
          {!tasks.length && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-6 text-center text-sm text-slate-400"
              >
                No tasks queued yet. Create a batch to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
