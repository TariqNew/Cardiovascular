/*
  Warnings:

  - You are about to drop the column `heartRate` on the `HealthLog` table. All the data in the column will be lost.
  - You are about to drop the column `mood` on the `HealthLog` table. All the data in the column will be lost.
  - You are about to drop the column `stressLevel` on the `HealthLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HealthLog" DROP COLUMN "heartRate",
DROP COLUMN "mood",
DROP COLUMN "stressLevel";
