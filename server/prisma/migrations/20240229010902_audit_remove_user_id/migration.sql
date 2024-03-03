/*
  Warnings:

  - You are about to drop the column `userId` on the `Audit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_userId_fkey";

-- AlterTable
ALTER TABLE "Audit" DROP COLUMN "userId";
