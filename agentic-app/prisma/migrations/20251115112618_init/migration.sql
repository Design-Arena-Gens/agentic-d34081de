-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "youtubeChannelId" TEXT NOT NULL,
    "youtubeRefreshToken" TEXT NOT NULL,
    "youtubeAccessToken" TEXT,
    "youtubeTokenExpiry" DATETIME,
    "postingTimezone" TEXT NOT NULL DEFAULT 'UTC',
    "defaultVideoSettings" JSONB
);

-- CreateTable
CREATE TABLE "VideoTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "channelId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "scheduledFor" DATETIME,
    "batchGroup" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "failureReason" TEXT,
    "scriptPlan" JSONB,
    "assetPlan" JSONB,
    "aiMetadata" JSONB,
    CONSTRAINT "VideoTask_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GeneratedVideo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "taskId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "youtubeVideoId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" JSONB,
    "script" JSONB NOT NULL,
    "stockAssets" JSONB,
    "captionsSrt" TEXT,
    "videoFilePath" TEXT,
    "audioFilePath" TEXT,
    "thumbnailPath" TEXT,
    "postedAt" DATETIME,
    CONSTRAINT "GeneratedVideo_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "VideoTask" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GeneratedVideo_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AgentRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taskId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "step" TEXT,
    "logs" JSONB,
    "durationMs" INTEGER,
    CONSTRAINT "AgentRun_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "VideoTask" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnalyticsSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "videoId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "watchTimeSec" REAL NOT NULL DEFAULT 0,
    "engagementRate" REAL NOT NULL DEFAULT 0,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawPayload" JSONB,
    CONSTRAINT "AnalyticsSnapshot_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "GeneratedVideo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_youtubeChannelId_key" ON "Channel"("youtubeChannelId");

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedVideo_taskId_key" ON "GeneratedVideo"("taskId");
