/*
  Warnings:

  - The `generation` column on the `Student` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `grade` column on the `Student` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `classNumber` column on the `Student` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `studentNumber` column on the `Student` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "generation",
ADD COLUMN     "generation" INTEGER,
DROP COLUMN "grade",
ADD COLUMN     "grade" INTEGER,
DROP COLUMN "classNumber",
ADD COLUMN     "classNumber" INTEGER,
DROP COLUMN "studentNumber",
ADD COLUMN     "studentNumber" INTEGER;
