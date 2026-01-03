-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "pubKey" TEXT NOT NULL,
    "refreshTokken" TEXT,
    "email" TEXT NOT NULL,
    "wallet_name" TEXT NOT NULL,
    "twoSetAuth" BOOLEAN NOT NULL DEFAULT false,
    "verification" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seed" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "encryptedSeed" TEXT NOT NULL,
    "authTag" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "backupReady" BOOLEAN NOT NULL DEFAULT true,
    "viewed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_name_key" ON "User"("wallet_name");

-- CreateIndex
CREATE UNIQUE INDEX "Seed_userId_key" ON "Seed"("userId");

-- AddForeignKey
ALTER TABLE "Seed" ADD CONSTRAINT "Seed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
