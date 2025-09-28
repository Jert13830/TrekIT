/*
  Warnings:

  - You are about to alter the column `siret` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(14)`.
  - A unique constraint covering the columns `[siret]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Company` MODIFY `siret` VARCHAR(14) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Company_siret_key` ON `Company`(`siret`);
