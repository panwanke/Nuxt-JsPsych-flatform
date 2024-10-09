/*
  Warnings:

  - You are about to drop the column `isAdded` on the `UserExperiment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Experiment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserExperiment" DROP COLUMN "isAdded";

-- CreateIndex
CREATE UNIQUE INDEX "Experiment_slug_key" ON "Experiment"("slug");
