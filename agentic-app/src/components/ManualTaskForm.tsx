"use client";

import { FormEvent, useState, useTransition } from "react";

type ManualTaskFormProps = {
  defaultNiche: string;
};

export function ManualTaskForm({ defaultNiche }: ManualTaskFormProps) {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState(defaultNiche);
  const [scheduledFor, setScheduledFor] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      setFeedback(null);
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          niche,
          scheduledFor: scheduledFor || undefined,
        }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        setFeedback(
          `Failed: ${error.error ?? response.statusText ?? "Unknown error"}`,
        );
        return;
      }
      setTopic("");
      setScheduledFor("");
      setFeedback("Task created and queued.");
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg space-y-4"
    >
      <div>
        <h3 className="text-lg font-semibold text-slate-100">
          Create one-off task
        </h3>
        <p className="text-sm text-slate-400">
          Craft a specific prompt or CTA and let the agent handle the rest.
        </p>
      </div>
      <label className="space-y-2">
        <span className="text-xs uppercase tracking-wide text-slate-400">
          Hook / topic
        </span>
        <textarea
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          rows={3}
          required
          placeholder="Example: This AI side hustle prints cash every night"
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500"
        />
      </label>
      <label className="space-y-2">
        <span className="text-xs uppercase tracking-wide text-slate-400">
          Niche
        </span>
        <input
          type="text"
          value={niche}
          onChange={(event) => setNiche(event.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500"
        />
      </label>
      <label className="space-y-2">
        <span className="text-xs uppercase tracking-wide text-slate-400">
          Schedule
        </span>
        <input
          type="datetime-local"
          value={scheduledFor}
          onChange={(event) => setScheduledFor(event.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Task"}
      </button>
      {feedback && (
        <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200">
          {feedback}
        </div>
      )}
    </form>
  );
}
