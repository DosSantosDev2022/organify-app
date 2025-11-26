-- CreateEnum
CREATE TYPE "PlannedPurchaseStatus" AS ENUM ('PENDING', 'PURCHASED');

-- CreateTable
CREATE TABLE "PlannedPurchase" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "PlannedPurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlannedPurchase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlannedPurchase" ADD CONSTRAINT "PlannedPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
