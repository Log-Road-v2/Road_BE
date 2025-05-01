import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();
console.log('Prisma has initted');

export { prisma, Role };
