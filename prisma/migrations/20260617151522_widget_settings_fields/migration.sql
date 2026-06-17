/*
  Warnings:

  - You are about to drop the column `description` on the `widget_settings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publicWidgetKey]` on the table `widget_settings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicWidgetKey` to the `widget_settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `widget_settings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WidgetPosition" AS ENUM ('bottom_right', 'bottom_left');

-- AlterTable
ALTER TABLE "widget_settings" DROP COLUMN "description",
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "position" "WidgetPosition" NOT NULL DEFAULT 'bottom_right',
ADD COLUMN     "publicWidgetKey" TEXT NOT NULL,
ADD COLUMN     "subtitle" TEXT NOT NULL DEFAULT 'Обычно отвечаем в течение нескольких минут',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "widget_settings_publicWidgetKey_key" ON "widget_settings"("publicWidgetKey");
