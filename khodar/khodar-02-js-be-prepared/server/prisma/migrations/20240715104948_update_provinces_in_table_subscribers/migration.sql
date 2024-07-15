/*
  Warnings:

  - Added the required column `province_is` to the `subscribers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscribers" ADD COLUMN     "province_is" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_province_is_fkey" FOREIGN KEY ("province_is") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
