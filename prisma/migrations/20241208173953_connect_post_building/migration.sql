/*
  Warnings:

  - You are about to alter the column `name` on the `building` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(20)`.
  - You are about to alter the column `enName` on the `building` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(20)`.
  - You are about to alter the column `gps` on the `building` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(30)`.
  - You are about to alter the column `code` on the `building` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(4)`.

*/
-- AlterTable
ALTER TABLE "building" ALTER COLUMN "name" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "enName" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "gps" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "code" SET DATA TYPE VARCHAR(4);

-- AlterTable
ALTER TABLE "post" ADD COLUMN     "buildingId" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "locationDetail" TEXT;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "building"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
