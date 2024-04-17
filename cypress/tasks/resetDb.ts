import prisma from '../../prisma/client';

export default async function resetDB() {
  return prisma.user.deleteMany({});
};