/*
  Warnings:

  - You are about to drop the column `location` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "post" DROP COLUMN "location";

-- CreateTable
CREATE TABLE "building" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "enName" VARCHAR(255) NOT NULL,
    "gps" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "building_pkey" PRIMARY KEY ("id")
);
