/*
  Warnings:

  - A unique constraint covering the columns `[addressMac]` on the table `Computer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Computer_addressMac_key` ON `Computer`(`addressMac`);
