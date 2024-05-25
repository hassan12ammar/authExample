/*
  Warnings:

  - You are about to drop the column `datebirth` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `datebirth`,
    ADD COLUMN `birthdate` DATE NULL;
