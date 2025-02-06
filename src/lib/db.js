import { PrismaClient } from '@prisma/client';
import { glob } from 'fs';
const prisma = glob.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') glob.prisma = prisma;{
  glob.prisma = prisma;
}

module.exports = {prisma};