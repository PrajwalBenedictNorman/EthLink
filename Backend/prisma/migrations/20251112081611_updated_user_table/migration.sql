/*
  Warnings:

  - Added the required column `wallet_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT,
ADD COLUMN     "verification" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wallet_name" TEXT NOT NULL;
