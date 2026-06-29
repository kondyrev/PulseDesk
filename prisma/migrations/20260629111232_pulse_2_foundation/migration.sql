-- CreateEnum
CREATE TYPE "PartnerRecommendationStatus" AS ENUM ('shown', 'clicked', 'dismissed');

-- CreateEnum
CREATE TYPE "PartnerEventType" AS ENUM ('intent_detected', 'recommendation_shown', 'recommendation_click', 'lead_created', 'conversion_reported');

-- AlterEnum
ALTER TYPE "TicketSource" ADD VALUE 'qr';

-- CreateTable
CREATE TABLE "qr_codes" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Основной QR-код',
    "description" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qr_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_categories" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "websiteUrl" TEXT,
    "logoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_placements" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_placements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intents" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "intents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_campaigns" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "categoryId" TEXT,
    "placementId" TEXT,
    "intentId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "targetAudience" TEXT,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_recommendations" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "partnerCampaignId" TEXT NOT NULL,
    "status" "PartnerRecommendationStatus" NOT NULL DEFAULT 'shown',
    "shownAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clickedAt" TIMESTAMP(3),
    "dismissedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_events" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT,
    "partnerId" TEXT,
    "campaignId" TEXT,
    "categoryId" TEXT,
    "placementId" TEXT,
    "intentId" TEXT,
    "eventType" "PartnerEventType" NOT NULL,
    "categoryCode" TEXT,
    "placementCode" TEXT,
    "intentCode" TEXT,
    "source" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "qr_codes_publicKey_key" ON "qr_codes"("publicKey");

-- CreateIndex
CREATE INDEX "qr_codes_workspaceId_idx" ON "qr_codes"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "partner_categories_code_key" ON "partner_categories"("code");

-- CreateIndex
CREATE INDEX "partners_categoryId_idx" ON "partners"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "partner_placements_code_key" ON "partner_placements"("code");

-- CreateIndex
CREATE UNIQUE INDEX "intents_code_key" ON "intents"("code");

-- CreateIndex
CREATE INDEX "intents_categoryId_idx" ON "intents"("categoryId");

-- CreateIndex
CREATE INDEX "partner_campaigns_partnerId_idx" ON "partner_campaigns"("partnerId");

-- CreateIndex
CREATE INDEX "partner_campaigns_categoryId_idx" ON "partner_campaigns"("categoryId");

-- CreateIndex
CREATE INDEX "partner_campaigns_placementId_idx" ON "partner_campaigns"("placementId");

-- CreateIndex
CREATE INDEX "partner_campaigns_intentId_idx" ON "partner_campaigns"("intentId");

-- CreateIndex
CREATE INDEX "partner_recommendations_workspaceId_idx" ON "partner_recommendations"("workspaceId");

-- CreateIndex
CREATE INDEX "partner_recommendations_partnerCampaignId_idx" ON "partner_recommendations"("partnerCampaignId");

-- CreateIndex
CREATE INDEX "partner_events_workspaceId_idx" ON "partner_events"("workspaceId");

-- CreateIndex
CREATE INDEX "partner_events_userId_idx" ON "partner_events"("userId");

-- CreateIndex
CREATE INDEX "partner_events_partnerId_idx" ON "partner_events"("partnerId");

-- CreateIndex
CREATE INDEX "partner_events_campaignId_idx" ON "partner_events"("campaignId");

-- CreateIndex
CREATE INDEX "partner_events_categoryId_idx" ON "partner_events"("categoryId");

-- CreateIndex
CREATE INDEX "partner_events_placementId_idx" ON "partner_events"("placementId");

-- CreateIndex
CREATE INDEX "partner_events_intentId_idx" ON "partner_events"("intentId");

-- CreateIndex
CREATE INDEX "partner_events_eventType_idx" ON "partner_events"("eventType");

-- CreateIndex
CREATE INDEX "partner_events_categoryCode_idx" ON "partner_events"("categoryCode");

-- CreateIndex
CREATE INDEX "partner_events_placementCode_idx" ON "partner_events"("placementCode");

-- CreateIndex
CREATE INDEX "partner_events_intentCode_idx" ON "partner_events"("intentCode");

-- CreateIndex
CREATE INDEX "partner_events_createdAt_idx" ON "partner_events"("createdAt");

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "partner_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intents" ADD CONSTRAINT "intents_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "partner_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_campaigns" ADD CONSTRAINT "partner_campaigns_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_campaigns" ADD CONSTRAINT "partner_campaigns_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "partner_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_campaigns" ADD CONSTRAINT "partner_campaigns_placementId_fkey" FOREIGN KEY ("placementId") REFERENCES "partner_placements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_campaigns" ADD CONSTRAINT "partner_campaigns_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "intents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_recommendations" ADD CONSTRAINT "partner_recommendations_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_recommendations" ADD CONSTRAINT "partner_recommendations_partnerCampaignId_fkey" FOREIGN KEY ("partnerCampaignId") REFERENCES "partner_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_events" ADD CONSTRAINT "partner_events_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_events" ADD CONSTRAINT "partner_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_events" ADD CONSTRAINT "partner_events_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_events" ADD CONSTRAINT "partner_events_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "partner_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_events" ADD CONSTRAINT "partner_events_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "partner_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_events" ADD CONSTRAINT "partner_events_placementId_fkey" FOREIGN KEY ("placementId") REFERENCES "partner_placements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_events" ADD CONSTRAINT "partner_events_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "intents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
