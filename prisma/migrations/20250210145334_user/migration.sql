/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Tareas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Tareas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tareas" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");

-- CreateIndex
CREATE UNIQUE INDEX "Tareas_userId_key" ON "Tareas"("userId");

-- AddForeignKey
ALTER TABLE "Tareas" ADD CONSTRAINT "Tareas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
