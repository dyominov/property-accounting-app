/* eslint-disable jsdoc/no-missing-syntax */
import { Operation } from "@prisma/client";
import prisma from "@/prisma/client";
import logger from "@/utils/logger";
// import logger from "@/utils/logger";

const initDb = async (req, res) => {

  try {
    const isCreatedRootUser = await prisma.user.findFirst({ where: { name: 'admin', password: 'admin' } });
    if (!isCreatedRootUser) {
      await prisma.user.create({ data: { name: 'admin', password: 'admin' } });
    }

    const isCreatedCategories = await prisma.supplyCategory.findMany({ where: { id: { in: [1, 2, 3, 4, 5, 6, 7, 8, 9] } } });
    if (isCreatedCategories.length === 0) {
      await prisma.supplyCategory.createMany({
        data: [
          { title: '1 категорія' },
          { title: '2 категорія' },
          { title: '3 категорія' },
          { title: '4 категорія' },
          { title: '5 категорія' },
          { title: 'Придатна' },
          { title: 'Потребує ремонту' },
          { title: 'Не придатна' },
          { title: 'Знищено' },
        ]
      });
    }

    const isCreatedDocumentTypes = await prisma.documentType.findMany({ where: { id: { in: [1, 2, 3, 4, 5, 6, 7, 8] } } });
    if (isCreatedDocumentTypes.length === 0) {
      await prisma.documentType.createMany({
        data: [
          { title: 'Не відомо' },
          { title: 'Накладна' },
          { title: 'Акт прийому передачі' },
          { title: 'Акт введення в експлуатацію' },
          { title: 'Акт тех. стану' },
          { title: 'Акт закладки' },
          { title: 'Акт списання' },
          { title: 'Акт закріплення обладнання' },
        ]
      });
    }

    const isCreatedIntegers = await prisma.integer.findMany({ where: { id: { in: [1, 2, 3, 4, 5, 6, 7] } } });
    if (isCreatedIntegers.length === 0) {
      await prisma.integer.createMany({
        data: [
          { title: 'шт.' },
          { title: 'к-т' },
          { title: 'м.п.' },
          { title: 'бухта' },
          { title: 'уп.' },
          { title: 'п.' },
          { title: 'кв. м.' },
        ]
      });
    }

    const isCreatedAllowedOperations = await prisma.allowedDocTypeToOperation.findMany({ where: { id: { in: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } } });
    if (isCreatedAllowedOperations.length === 0) {
      await prisma.allowedDocTypeToOperation.createMany({
        data: [
          {
            operation: Operation.ADD_SUPPLY,
            docTypeId: 1,
          },
          {
            operation: Operation.ADD_SUPPLY,
            docTypeId: 2,
          },
          {
            operation: Operation.ADD_SUPPLY,
            docTypeId: 3,
          },
          {
            operation: Operation.PIN_MAIN_ASSET,
            docTypeId: 1,
          },
          {
            operation: Operation.PIN_MAIN_ASSET,
            docTypeId: 8,
          },
          {
            operation: Operation.TRANSFER_SUPPLY,
            docTypeId: 1,
          },
          {
            operation: Operation.TRANSFER_SUPPLY,
            docTypeId: 2,
          },
          {
            operation: Operation.TRANSFER_SUPPLY,
            docTypeId: 3,
          },
          {
            operation: Operation.CHANGE_CATEGORY,
            docTypeId: 1,
          },
          {
            operation: Operation.CHANGE_CATEGORY,
            docTypeId: 5,
          },
        ]
      });
    }

    const isCreatedNotSystemUnits = await prisma.notSystemUnit.findMany({ where: { id: { in: [1, 2, 3, 4, 5, 6, 7] } } });
    if (isCreatedNotSystemUnits.length === 0) {
      await prisma.notSystemUnit.createMany({
        data: [
          { title: 'в/ч А0000' },
          { title: 'в/ч А0001' },
          { title: 'в/ч А0002' },
          { title: 'в/ч А0003' },
          { title: 'в/ч А1010' },
          { title: 'в/ч А0666' },
          { title: 'в/ч А7979' },
        ]
      });
    }

    return res.status(200).end();

  } catch (error) {
    logger.error(error);
    return res.status(500).json(error);
  }
};

export default initDb;