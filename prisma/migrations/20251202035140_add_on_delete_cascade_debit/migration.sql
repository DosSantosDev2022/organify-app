-- DropForeignKey
ALTER TABLE "DebtPayment" DROP CONSTRAINT "DebtPayment_debtId_fkey";

-- AddForeignKey
ALTER TABLE "DebtPayment" ADD CONSTRAINT "DebtPayment_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "Debt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
