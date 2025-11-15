import { VideoLibrary } from "@/components/VideoLibrary";
import { prisma } from "@/lib/prisma";

const getVideos = async () => {
  const videos = await prisma.generatedVideo.findMany({
    include: {
      analytics: {
        orderBy: { recordedAt: "desc" },
        take: 5,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  return videos.map((video) => ({
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
};

export default async function VideosPage() {
  const videos = await getVideos();
  return (
    <div className="flex flex-col gap-8 px-6 py-10 lg:px-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-slate-50">
          Video intelligence
        </h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Track how every production performs after the agent uploads to
          YouTube. Engagement snapshots update automatically via the analytics
          sync.
        </p>
      </header>

      <VideoLibrary videos={videos} />
    </div>
  );
}
