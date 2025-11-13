/*
  Warnings:

  - A unique constraint covering the columns `[userId,normalizedName]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `normalizedName` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Category_userId_name_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "normalizedName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_userId_normalizedName_key" ON "Category"("userId", "normalizedName");
