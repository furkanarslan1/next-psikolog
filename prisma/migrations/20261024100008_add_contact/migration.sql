-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "email" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "address" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
