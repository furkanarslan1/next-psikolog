-- CreateTable
CREATE TABLE "About" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "summary" TEXT NOT NULL,
    "content" TEXT,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "imageWidth" INTEGER,
    "imageHeight" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "About_pkey" PRIMARY KEY ("id")
);
