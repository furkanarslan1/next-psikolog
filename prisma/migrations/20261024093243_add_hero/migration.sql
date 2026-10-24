-- CreateTable
CREATE TABLE "Hero" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "headline" TEXT NOT NULL,
    "buttonLabel" TEXT NOT NULL,
    "buttonUrl" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);
