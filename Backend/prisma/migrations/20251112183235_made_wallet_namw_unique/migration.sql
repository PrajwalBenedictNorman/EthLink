/*
  Warnings:

  - A unique constraint covering the columns `[wallet_name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_name_key" ON "User"("wallet_name");
