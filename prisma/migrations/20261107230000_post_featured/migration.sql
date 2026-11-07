-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;
-- CreateIndex
CREATE INDEX "Post_status_featured_publishedAt_idx" ON "Post"("status", "featured", "publishedAt");
