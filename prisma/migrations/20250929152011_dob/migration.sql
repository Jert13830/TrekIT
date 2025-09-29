/*
  Warnings:

  - You are about to drop the column `age` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Employee` DROP COLUMN `age`,
    ADD COLUMN `dob` DATETIME(3) NULL;
