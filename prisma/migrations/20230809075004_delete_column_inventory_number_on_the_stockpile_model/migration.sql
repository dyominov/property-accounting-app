/*
  Warnings:

  - You are about to drop the column `inventoryNumber` on the `Stockpile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cost,title]` on the table `Stockpile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Stockpile" DROP COLUMN "inventoryNumber";

-- CreateIndex
CREATE UNIQUE INDEX "Stockpile_cost_title_key" ON "Stockpile"("cost", "title");
