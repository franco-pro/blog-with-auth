/*
  Warnings:

  - You are about to drop the column `id_category` on the `posts` table. All the data in the column will be lost.
  - Added the required column `name_category` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `Posts_id_category_fkey`;

-- AlterTable
ALTER TABLE `posts` DROP COLUMN `id_category`,
    ADD COLUMN `name_category` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_name_category_fkey` FOREIGN KEY (`name_category`) REFERENCES `Category`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
