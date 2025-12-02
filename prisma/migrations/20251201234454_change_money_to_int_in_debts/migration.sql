/*
  Warnings:

  - You are about to alter the column `totalAmount` on the `Debt` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `amountPaid` on the `DebtPayment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Debt" ALTER COLUMN "totalAmount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "DebtPayment" ALTER COLUMN "amountPaid" SET DATA TYPE INTEGER;
