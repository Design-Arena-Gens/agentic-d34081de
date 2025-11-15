"use client";

import { useState, useTransition } from "react";

type AgentActionsProps = {
  className?: string;
};

export function AgentActions({ className }: AgentActionsProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const invoke = (endpoint: string, successMessage: string) => {
    setMessage(null);
    startTransition(async () => {
      const response = await fetch(endpoint, { method: "POST" });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        setMessage(
          `Failed: ${error.error ?? response.statusText ?? "Unknown error"}`,
        );
        return;
      }
      setMessage(successMessage);
    });
  };

  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg ${className ?? ""}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-50">Agent control</h3>
          <p className="text-sm text-slate-400">
            Trigger the autonomous pipeline or refresh performance analytics.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              invoke("/api/agent/run", "Agent successfully generated new videos.")
            }
            disabled={isPending}
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-900 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Running..." : "Run Agent"}
          </button>
          <button
            type="button"
            onClick={() =>
              invoke(
                "/api/analytics/refresh",
                "Analytics refreshed from YouTube successfully.",
              )
            }
            disabled={isPending}
            className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Syncing..." : "Sync Analytics"}
          </button>
        </div>
      </div>
      {message && (
        <div className="mt-4 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">
          {message}
        </div>
      )}
    </div>
  );
}
