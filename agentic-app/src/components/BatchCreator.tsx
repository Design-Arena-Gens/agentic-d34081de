"use client";

import { FormEvent, useState, useTransition } from "react";

type BatchCreatorProps = {
  defaultNiche: string;
};

export function BatchCreator({ defaultNiche }: BatchCreatorProps) {
  const [niche, setNiche] = useState(defaultNiche);
  const [count, setCount] = useState(3);
  const [scheduledFor, setScheduledFor] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const response = await fetch("/api/tasks/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          count,
          niche,
          scheduledFor: scheduledFor || undefined,
        }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        setFeedback(
          `Error ${response.status}: ${error.error ?? "Unable to create batch"}`,
        );
        return;
      }
      const data = await response.json();
      setFeedback(`Created ${data.tasks.length} new tasks.`);
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg space-y-4"
    >
      <div>
        <h3 className="text-lg font-semibold text-slate-50">
          Batch generation
        </h3>
        <p className="text-sm text-slate-400">
          Queue multiple Shorts using automated topic discovery. Pick a schedule
          to auto-post.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-wide text-slate-400">
            Niche / angle
          </span>
          <input
            type="text"
            value={niche}
            onChange={(event) => setNiche(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500"
            placeholder="AI Side Hustles, Passive Income, etc."
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-wide text-slate-400">
            Batch size
          </span>
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-xs uppercase tracking-wide text-slate-400">
            Schedule (optional)
          </span>
          <input
            type="datetime-local"
            value={scheduledFor}
            onChange={(event) => setScheduledFor(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Queuing..." : "Queue Batch"}
      </button>

      {feedback && (
        <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
          {feedback}
        </div>
      )}
    </form>
  );
}
