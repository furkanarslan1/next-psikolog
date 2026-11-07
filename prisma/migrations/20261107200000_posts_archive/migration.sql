CREATE TYPE "PostType" AS ENUM ('YAZI', 'CEVIRI');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_B_fkey";

-- DropIndex
DROP INDEX "Post_categoryId_idx";

-- AlterTable
ALTER TABLE "About" DROP COLUMN "imageAlt",
DROP COLUMN "imageHeight",
DROP COLUMN "imageUrl",
DROP COLUMN "imageWidth";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "x";

-- AlterTable
ALTER TABLE "Hero" DROP COLUMN "buttonLabel",
DROP COLUMN "buttonUrl",
DROP COLUMN "imageAlt",
DROP COLUMN "imageHeight",
DROP COLUMN "imageUrl",
DROP COLUMN "imageWidth";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "categoryId",
DROP COLUMN "coverImageAlt",
DROP COLUMN "coverImageUrl",
ADD COLUMN     "fullText" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lang" TEXT NOT NULL DEFAULT 'tr',
ADD COLUMN     "originalAuthor" TEXT,
ADD COLUMN     "originalLang" TEXT,
ADD COLUMN     "originalTitle" TEXT,
ADD COLUMN     "publishedIn" TEXT,
ADD COLUMN     "sourceCitation" TEXT,
ADD COLUMN     "sourceUrl" TEXT,
ADD COLUMN     "type" "PostType" NOT NULL DEFAULT 'YAZI';

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_PostToTag";

-- CreateIndex
CREATE INDEX "Post_status_type_publishedAt_idx" ON "Post"("status", "type", "publishedAt");

