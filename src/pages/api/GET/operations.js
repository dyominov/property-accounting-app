import moment from 'moment';
import prisma from "@/prisma/client";
import { DocumentStatus } from "@prisma/client";
import logger from "@/utils/logger";
import { isAuthenticated } from '../../../lib/auth';

const DATE_FORMAT = process.env.DATE_FORMAT;

/**
 * @swagger
 * /api/GET/operations:
 *   get:
 *     summary: Returns list of operations
 *     description: Returns list of all operations with documents
 *     security:
 *       - BearerAuth: [bearer]
 *     responses:
 *       200:
 *         description: A JSON list of all operations with documents
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "./schemas/api-get-operations.yaml#/Operation"
 */
const handler = async (req, res) => {
  const isUserAuthenticated = await isAuthenticated(req);
  if (!isUserAuthenticated) {
    return res.status(401).end();
  }

  if (req.method === 'GET') {
    try {
      const documentsAddSuply = await prisma.documentAddSupply.findMany({
        where: { status: { in: [DocumentStatus.REALIZED, DocumentStatus.REALIZED_DISABLED] } }, include: {
          type: { include: { docType: true } },
          mainAssets: true,
          stockpile: true,
          realizator: true,
        }
      });

      const documentsPinMainAsset = await prisma.documentPinMainAsset.findMany({
        where: { status: { in: [DocumentStatus.REALIZED, DocumentStatus.REALIZED_DISABLED] } }, include: {
          type: { include: { docType: true } },
          mainAssets: true,
          realizator: true,
        }
      });

      const documentsTransferSupply = await prisma.documentTransferSupply.findMany({
        where: { status: { in: [DocumentStatus.REALIZED, DocumentStatus.REALIZED_DISABLED] } }, include: {
          type: { include: { docType: true } },
          mainAssets: true,
          stockpile: { include: { parent: true }},
          realizator: true,
        }
      });


      const documentsChangeCategory = await prisma.documentChangeCategory.findMany({
        where: { status: { in: [DocumentStatus.REALIZED, DocumentStatus.REALIZED_DISABLED] } }, include: {
          type: { include: { docType: true } },
          mainAssets: true,
          realizator: true,
        }
      });


      const dataAddSupply = documentsAddSuply.map(doc => {
        let maOperations = [];
        let stockpileOperations = [];

        if (doc.mainAssets) {
          maOperations = doc.mainAssets.map(ma => {
            return {
              title: ma.title,
              inventoryNumber: ma.inventoryNumber,
              serialNumber: ma.serialNumber,
              cost: ma.cost,
              type: doc.type.operation,
              document: `${doc.type.docType.title} №${doc.number} від ${moment(doc.date).format(DATE_FORMAT)}`,
              date: moment(doc.realizedAt).format(DATE_FORMAT),
              user: doc.realizator.name,
              scans: '',
            };
          });
        }

        if (doc.stockpile) {
          stockpileOperations = doc.stockpile.map(spl => {
            return {
              title: spl.title,
              inventoryNumber: spl.inventoryNumber,
              serialNumber: spl.serialNumber,
              cost: spl.cost,
              type: doc.type.operation,
              document: `${doc.type.docType.title} №${doc.number} від ${moment(doc.date).format(DATE_FORMAT)}`,
              date: moment(doc.realizedAt).format(DATE_FORMAT),
              user: doc.realizator.name,
              scans: '',
            };
          });
        }

        return maOperations.concat(stockpileOperations);
      }).flat();

      const dataPinnedMainAsset = documentsPinMainAsset.map(doc => {
        let maOperations = [];

        if (doc.mainAssets) {
          maOperations = doc.mainAssets.map(ma => {
            return {
              title: ma.title,
              inventoryNumber: ma.inventoryNumber,
              serialNumber: ma.serialNumber,
              cost: ma.cost,
              type: doc.type.operation,
              document: `${doc.type.docType.title} №${doc.number} від ${moment(doc.date).format(DATE_FORMAT)}`,
              date: moment(doc.realizedAt).format(DATE_FORMAT),
              user: doc.realizator.name,
              scans: '',
            };
          });
        }

        return maOperations;
      }).flat();

      const dataTransferSupply = documentsTransferSupply.map(doc => {
        let maOperations = [];
        let stockpileOperations = [];

        if (doc.mainAssets) {
          maOperations = doc.mainAssets.map(ma => {
            return {
              title: ma.title,
              inventoryNumber: ma.inventoryNumber,
              serialNumber: ma.serialNumber,
              cost: ma.cost,
              type: doc.type.operation,
              document: `${doc.type.docType.title} №${doc.number} від ${moment(doc.date).format(DATE_FORMAT)}`,
              date: moment(doc.realizedAt).format(DATE_FORMAT),
              user: doc.realizator.name,
              scans: '',
            };
          });
        }

        if (doc.stockpile) {
          stockpileOperations = doc.stockpile.map(spl => {
            return {
              title: spl.parent.title,
              inventoryNumber: spl.parent.inventoryNumber,
              serialNumber: spl.parent.serialNumber,
              cost: spl.parent.cost,
              type: doc.type.operation,
              document: `${doc.type.docType.title} №${doc.number} від ${moment(doc.date).format(DATE_FORMAT)}`,
              date: moment(doc.realizedAt).format(DATE_FORMAT),
              user: doc.realizator.name,
              scans: '',
            };
          });
        }

        return maOperations.concat(stockpileOperations);
      }).flat();

      const dataChangedCategory = documentsChangeCategory.map(doc => {
        let maOperations = [];

        if (doc.mainAssets) {
          maOperations = doc.mainAssets.map(ma => {
            return {
              title: ma.title,
              inventoryNumber: ma.inventoryNumber,
              serialNumber: ma.serialNumber,
              cost: ma.cost,
              type: doc.type.operation,
              document: `${doc.type.docType.title} №${doc.number} від ${moment(doc.date).format(DATE_FORMAT)}`,
              date: moment(doc.realizedAt).format(DATE_FORMAT),
              user: doc.realizator.name,
              scans: '',
            };
          });
        }

        return maOperations;
      }).flat();

      const data = [
        ...dataAddSupply,
        ...dataPinnedMainAsset,
        ...dataTransferSupply,
        ...dataChangedCategory,
      ];

      return res.status(200).json(data);
    } catch (error) {
      logger.error(error);
      return res.status(500).json(error);
    }
  }

};

export default handler;
