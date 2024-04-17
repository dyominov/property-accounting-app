import prisma from '../../prisma/client';
import { DEFAULT_EMPLOYEES } from '../constants';

export default async function seedDB() {
  return await prisma.user.createMany({
    data: DEFAULT_EMPLOYEES,
  });
};