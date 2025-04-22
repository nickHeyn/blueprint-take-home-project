/*
  Warnings:

  - You are about to drop the column `threhold_inclusive` on the `Level2Assessment` table. All the data in the column will be lost.
  - Added the required column `threshold_inclusive` to the `Level2Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Level2Assessment" DROP COLUMN "threhold_inclusive",
ADD COLUMN     "threshold_inclusive" BOOLEAN NOT NULL;
