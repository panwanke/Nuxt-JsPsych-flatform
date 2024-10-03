-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "password" TEXT NOT NULL,
    "passwordResetToken" TEXT,
    "photoUrl" TEXT,
    "institution" TEXT,
    "age" INTEGER,
    "gender" "Gender" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experiment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "slug" TEXT NOT NULL,
    "remuneration" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),

    CONSTRAINT "Experiment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserExperiment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "experimentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isAdded" BOOLEAN NOT NULL DEFAULT false,
    "isDone" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserExperiment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "experimentId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserExperiment_userId_experimentId_key" ON "UserExperiment"("userId", "experimentId");

-- AddForeignKey
ALTER TABLE "UserExperiment" ADD CONSTRAINT "UserExperiment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExperiment" ADD CONSTRAINT "UserExperiment_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
