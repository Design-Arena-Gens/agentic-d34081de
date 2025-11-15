"use client";

import { formatDistanceToNow } from "date-fns";

type VideoLibraryProps = {
  videos: {
    id: string;
    title: string;
    description: string;
    youtubeVideoId: string | null;
    postedAt: string | null;
    tags: string[] | null;
    analytics: {
      id: string;
      views: number;
      likes: number;
      engagementRate: number;
    }[];
  }[];
};

export function VideoLibrary({ videos }: VideoLibraryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {videos.map((video) => {
        const latestAnalytics = video.analytics.at(0);
        return (
          <div
            key={video.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-50">
                  {video.title}
                </h3>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Posted{" "}
                  {video.postedAt
                    ? formatDistanceToNow(new Date(video.postedAt), {
                        addSuffix: true,
                      })
                    : "scheduled"}
                </p>
              </div>
              {video.youtubeVideoId && (
                <a
                  href={`https://youtu.be/${video.youtubeVideoId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  View
                </a>
              )}
            </div>
            <p className="mt-3 line-clamp-3 text-sm text-slate-300">
              {video.description}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2">
                <div className="text-xs uppercase text-slate-400">Views</div>
                <div className="font-semibold text-emerald-400">
                  {latestAnalytics?.views ?? 0}
                </div>
              </div>
              <div className="rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2">
                <div className="text-xs uppercase text-slate-400">Likes</div>
                <div className="font-semibold text-emerald-400">
                  {latestAnalytics?.likes ?? 0}
                </div>
              </div>
              <div className="rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2">
                <div className="text-xs uppercase text-slate-400">
                  Engagement
                </div>
                <div className="font-semibold text-emerald-400">
                  {Math.round((latestAnalytics?.engagementRate ?? 0) * 100)}%
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Tags: {video.tags?.slice(0, 6).join(", ") ?? "-"}
            </div>
          </div>
        );
      })}
      {!videos.length && (
        <div className="col-span-full rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center text-sm text-slate-400">
          No published Shorts yet. Trigger the agent to publish your first batch.
        </div>
      )}
    </div>
  );
}
