/*
  Warnings:

  - You are about to drop the column `AuthorId` on the `Tweet` table. All the data in the column will be lost.
  - You are about to drop the column `ImageURL` on the `Tweet` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Tweet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_AuthorId_fkey";

-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "AuthorId",
DROP COLUMN "ImageURL",
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "imageURL" TEXT;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
