/*
  Warnings:

  - You are about to drop the column `status` on the `Category` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('RECEIVED', 'PENDING', 'PAID');

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "CategoryStatus";
