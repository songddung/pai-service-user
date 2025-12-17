/*
  Warnings:

  - Made the column `birth_date` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "birth_date" SET NOT NULL;
