-- CreateTable
CREATE TABLE `Company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyName` VARCHAR(255) NOT NULL,
    `siret` VARCHAR(14) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `directorName` VARCHAR(255) NULL,

    UNIQUE INDEX `Company_siret_key`(`siret`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Computer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `computerTitle` VARCHAR(255) NOT NULL,
    `addressMac` VARCHAR(255) NOT NULL,
    `purchaseDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(10) NOT NULL,
    `companyId` INTEGER NOT NULL,
    `employeeId` INTEGER NULL,

    UNIQUE INDEX `Computer_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `age` INTEGER NULL,
    `gender` VARCHAR(10) NULL,
    `companyId` INTEGER NOT NULL,

    UNIQUE INDEX `Employee_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Computer` ADD CONSTRAINT `Computer_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Computer` ADD CONSTRAINT `Computer_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
