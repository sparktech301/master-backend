/*
  Warnings:

  - You are about to drop the column `discription` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `discription` on the `Service` table. All the data in the column will be lost.
  - Added the required column `description` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "discription",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "discription",
ADD COLUMN     "description" TEXT NOT NULL;
