export type HookBlueprint = {
  hook: string;
  storyBeats: string[];
  callToAction: string;
};

export type VisualCue = {
  timestamp: number;
  duration: number;
  description: string;
  overlayText?: string;
  assetUrl?: string;
};

export type ScriptPlan = {
  niche: string;
  topic: string;
  durationSeconds: number;
  script: string;
  hookBlueprint: HookBlueprint;
  visualPlan: VisualCue[];
  captions: string[];
  keywords: string[];
};

export type GeneratedAssets = {
  videoPath: string;
  audioPath: string;
  captionsPath: string;
  thumbnailPath?: string;
  stockSources: VisualCue[];
};

export type YoutubeMetadata = {
  title: string;
  description: string;
  tags: string[];
  scheduleTime?: string;
};

export type AgentReport = {
  status: "success" | "failed";
  startedAt: string;
  finishedAt: string;
  steps: {
    name: string;
    status: "success" | "failed";
    detail?: string;
  }[];
};

export type TaskWithResult = import("@prisma/client").VideoTask & {
  result: import("@prisma/client").GeneratedVideo | null;
};

export type VideoWithAnalytics = import("@prisma/client").GeneratedVideo & {
  analytics: import("@prisma/client").AnalyticsSnapshot[];
};
