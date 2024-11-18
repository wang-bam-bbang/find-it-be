-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('ELECTRONICS', 'CARD', 'CLOTHING', 'BAG', 'WALLET', 'ACCESSORIES', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('PENDING', 'RESOLVED');

-- CreateTable
CREATE TABLE "User" (
    "uuid" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "FoundPost" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "location" TEXT NOT NULL,
    "category" "ItemCategory" NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING',
    "authorId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoundPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LostPost" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "location" TEXT NOT NULL,
    "category" "ItemCategory" NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING',
    "authorId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LostPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "FoundPost_authorId_idx" ON "FoundPost"("authorId");

-- CreateIndex
CREATE INDEX "LostPost_authorId_idx" ON "LostPost"("authorId");

-- AddForeignKey
ALTER TABLE "FoundPost" ADD CONSTRAINT "FoundPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LostPost" ADD CONSTRAINT "LostPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
