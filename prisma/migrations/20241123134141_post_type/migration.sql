/*
  Warnings:

  - The values [OTHER] on the enum `ItemCategory` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ItemCategory_new" AS ENUM ('ELECTRONICS', 'CARD', 'CLOTHING', 'BAG', 'WALLET', 'ACCESSORIES', 'DOCUMENT', 'ETC');
ALTER TABLE "Post" ALTER COLUMN "category" TYPE "ItemCategory_new" USING ("category"::text::"ItemCategory_new");
ALTER TYPE "ItemCategory" RENAME TO "ItemCategory_old";
ALTER TYPE "ItemCategory_new" RENAME TO "ItemCategory";
DROP TYPE "ItemCategory_old";
COMMIT;

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "category" SET DEFAULT 'ETC',
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");
