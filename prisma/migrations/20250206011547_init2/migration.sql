-- CreateEnum
CREATE TYPE "Status" AS ENUM ('COMPLETA', 'INCOMPLETA');

-- CreateTable
CREATE TABLE "Tareas" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'INCOMPLETA',

    CONSTRAINT "Tareas_pkey" PRIMARY KEY ("id")
);
