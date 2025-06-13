import { PrismaClient, Role, StudentState, ContestState, Author, ProjectState } from '@prisma/client';

const prisma = new PrismaClient();
console.log('Prisma has initted');

export { prisma, Role, StudentState, ContestState, Author, ProjectState };
