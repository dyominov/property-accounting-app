import prisma from "@/prisma/client";
import { Operation } from "@prisma/client";
import logger from "@/utils/logger";
import { isAuthenticated } from "../../../../../lib/auth";

/**
 * @swagger
 * /api/GET/document/{operation}/types:
 *   get:
 *     summary: Returns list of types of documents
 *     description: Returns list of document types by specific document operation
 *     security:
 *       - BearerAuth: [bearer]
 *     responses:
 *       200:
 *         description: A JSON list of document types
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "./schemas/api-get-document-{operation}-types.yaml#/DocumentType"
 */
const handler = async (req, res) => {
  const isUserAuthenticated = await isAuthenticated(req);
  if (!isUserAuthenticated) {
    return res.status(401).end();
  }

  if (req.method === 'GET') {
    const { operation } = req.query;
    try {
      let data;
      switch (operation) {
        case 'add-supply':
          data = await prisma.allowedDocTypeToOperation.findMany({ where: { operation: Operation.ADD_SUPPLY }, include: { docType: true } });
          break;
        case 'pin-ma':
          data = await prisma.allowedDocTypeToOperation.findMany({ where: { operation: Operation.PIN_MAIN_ASSET }, include: { docType: true } });
          break;
        case 'transfer-supply':
          data = await prisma.allowedDocTypeToOperation.findMany({ where: { operation: Operation.TRANSFER_SUPPLY }, include: { docType: true } });
          break;
        case 'change-ma-category':
          data = await prisma.allowedDocTypeToOperation.findMany({ where: { operation: Operation.CHANGE_CATEGORY }, include: { docType: true } });
          break;
        default:
          break;
      }

      return res.status(200).json(data);
    } catch (error) {
      logger.error(error);
      return res.status(500).json(error);
    }
  }
};

export default handler;
