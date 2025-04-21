/*
  Warnings:

  - You are about to drop the column `display_name` on the `Section` table. All the data in the column will be lost.
  - Added the required column `display_name` to the `Screener` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Screener" ADD COLUMN     "display_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "display_name";
