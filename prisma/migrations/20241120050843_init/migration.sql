-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('ELECTRONICS', 'CARD', 'CLOTHING', 'BAG', 'WALLET', 'ACCESSORIES', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('IN_PROGRESS', 'RESOLVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('FOUND', 'LOST');

-- CreateTable
CREATE TABLE "User" (
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL,
    "type" "PostType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "location" JSONB NOT NULL,
    "category" "ItemCategory" NOT NULL,
    "status" "PostStatus" NOT NULL,
    "authorId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
