/*
  Warnings:

  - You are about to alter the column `siret` on the `Company` table. The data in that column could be lost. The data in that column will be cast from `VarChar(17)` to `VarChar(14)`.

*/
-- AlterTable
ALTER TABLE `Company` MODIFY `siret` VARCHAR(14) NOT NULL;
