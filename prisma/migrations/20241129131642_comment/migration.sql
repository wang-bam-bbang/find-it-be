/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `comment` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comment" DROP COLUMN "updatedAt",
ADD COLUMN     "authorId" UUID NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
