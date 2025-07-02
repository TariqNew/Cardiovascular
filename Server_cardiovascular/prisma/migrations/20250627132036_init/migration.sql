-- CreateEnum
CREATE TYPE "MealSource" AS ENUM ('AI', 'USER', 'IMPORTED');

-- AlterTable
ALTER TABLE "HealthLog" ADD COLUMN     "heartRate" DOUBLE PRECISION,
ADD COLUMN     "mood" TEXT,
ADD COLUMN     "stressLevel" "StressLevel";

-- AlterTable
ALTER TABLE "meal_logs" ADD COLUMN     "source" "MealSource" NOT NULL DEFAULT 'AI';
