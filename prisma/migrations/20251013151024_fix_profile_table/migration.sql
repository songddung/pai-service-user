/*
  Warnings:

  - Made the column `gender` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "gender" SET NOT NULL;
