-- CreateTable
CREATE TABLE `Fault` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `faultDescription` VARCHAR(255) NOT NULL,
    `faultStartDate` DATETIME(3) NOT NULL,
    `faultEndDate` DATETIME(3) NULL,
    `cost` DECIMAL(10, 2) NOT NULL,
    `computerId` INTEGER NOT NULL,
    `employeeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Fault` ADD CONSTRAINT `Fault_computerId_fkey` FOREIGN KEY (`computerId`) REFERENCES `Computer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fault` ADD CONSTRAINT `Fault_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
