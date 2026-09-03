-- AlterTable
ALTER TABLE "Set" ADD COLUMN     "workout_id" TEXT;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
