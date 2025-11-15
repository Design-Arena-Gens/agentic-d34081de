import { AgentActions } from "@/components/AgentActions";
import { BatchCreator } from "@/components/BatchCreator";
import { TasksTable } from "@/components/TasksTable";
import { VideoLibrary } from "@/components/VideoLibrary";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const getDashboardData = async () => {
  const [tasks, videos, analytics] = await Promise.all([
    prisma.videoTask.findMany({
      include: { result: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.generatedVideo.findMany({
      include: {
        analytics: {
          orderBy: { recordedAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.analyticsSnapshot.findMany({
      orderBy: { recordedAt: "desc" },
      take: 50,
    }),
  ]);

  const totalViews = analytics.reduce((sum, entry) => sum + entry.views, 0);
  const totalLikes = analytics.reduce((sum, entry) => sum + entry.likes, 0);
  const totalComments = analytics.reduce(
    (sum, entry) => sum + entry.comments,
    0,
  );

  const tasksSerialized = tasks.map((task) => ({
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

  const videosSerialized = videos.map((video) => ({
    id: video.id,
    title: video.title,
    description: video.description,
    youtubeVideoId: video.youtubeVideoId,
    postedAt: video.postedAt?.toISOString() ?? null,
    tags: (video.tags as string[] | null) ?? null,
    analytics: video.analytics.map((entry) => ({
      id: entry.id,
      views: entry.views,
      likes: entry.likes,
      engagementRate: entry.engagementRate,
    })),
  }));

  return {
    stats: {
      totalTasks: tasks.length,
      totalVideos: videos.length,
      totalViews,
      totalLikes,
      totalComments,
    },
    tasks: tasksSerialized,
    videos: videosSerialized,
  };
};

export default async function DashboardPage() {
  const data = await getDashboardData();
  return (
    <div className="flex flex-col gap-8 px-6 py-10 lg:px-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-slate-50">
          Autonomous Shorts Control Center
        </h1>
        <p className="max-w-2xl text-sm text-slate-400">
          ShortFuse discovers trending topics, writes scripts, generates
          visuals, produces a full Short, and schedules uploads to your channel.
          Monitor performance or trigger new batches instantly.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
          <div className="text-xs uppercase tracking-widest text-slate-400">
            Total videos
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-50">
            {data.stats.totalVideos}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
          <div className="text-xs uppercase tracking-widest text-slate-400">
            Views captured
          </div>
          <div className="mt-2 text-3xl font-semibold text-emerald-400">
            {data.stats.totalViews}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
          <div className="text-xs uppercase tracking-widest text-slate-400">
            Audience love
          </div>
          <div className="mt-2 text-3xl font-semibold text-emerald-400">
            {data.stats.totalLikes} likes
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
          <div className="text-xs uppercase tracking-widest text-slate-400">
            Feedback
          </div>
          <div className="mt-2 text-3xl font-semibold text-emerald-400">
            {data.stats.totalComments} comments
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <AgentActions className="lg:col-span-3" />
        <BatchCreator
          defaultNiche={env.DEFAULT_NICHE ?? "INSERT NICHE HERE"}
        />
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-50">
            Workflow summary
          </h3>
          <ol className="mt-3 space-y-3 text-sm text-slate-300">
            <li>
              1. Gather trending intel and draft a Shorts script with hook,
              beats, and CTA.
            </li>
            <li>
              2. Assemble visuals, captions, stock clips, and synthesize a TTS
              voiceover.
            </li>
            <li>
              3. Render the Short, generate metadata, upload, and schedule on
              YouTube.
            </li>
            <li>
              4. Track engagement automatically with rolling analytics
              snapshots.
            </li>
          </ol>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">
          Production queue
        </h2>
        <TasksTable tasks={data.tasks} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">
          Published Shorts
        </h2>
        <VideoLibrary videos={data.videos} />
      </section>
    </div>
  );
}
