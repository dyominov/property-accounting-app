import prisma from "@/prisma/client";
import logger from "@/utils/logger";
import { isAuthenticated } from "../../../lib/auth";

/**
 * @swagger
 * /api/GET/documents:
 *   get:
 *     summary: Returns list of documents
 *     description: Returns list of all documents to view
 *     security:
 *       - BearerAuth: [bearer]
 *     responses:
 *       200:
 *         description: A JSON list of all documents
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "./schemas/api-get-documents.yaml#/Document"
 */
const handler = async (req, res) => {
  const isUserAuthenticated = await isAuthenticated(req);
  if (!isUserAuthenticated) {
    return res.status(401).end();
  }

  if (req.method === 'GET') {
    try {
      const docAddSupplyList = await prisma.documentAddSupply.findMany({
        select: {
          id: true,
          number: true,
          realizedAt: true,
          type: { select: { docType: true, operation: true } },
          creator: { select: { name: true }},
          date: true,
        }
      });

      const docPinMainAssetList = await prisma.documentPinMainAsset.findMany({
        select: {
          id: true,
          number: true,
          realizedAt: true,
          type: { select: { docType: true, operation: true } },
          creator: { select: { name: true }},
          date: true,
        }
      });

      const docTransferrSupplyList = await prisma.documentTransferSupply.findMany({
        select: {
          id: true,
          number: true,
          realizedAt: true,
          type: { select: { docType: true, operation: true } },
          creator: { select: { name: true }},
          date: true,
        }
      });

      const docChangeCategoryList = await prisma.documentChangeCategory.findMany({
        select: {
          id: true,
          number: true,
          realizedAt: true,
          type: { select: { docType: true, operation: true } },
          creator: { select: { name: true }},
          date: true,
        }
      });

      const data = [
        ...docAddSupplyList,
        ...docPinMainAssetList,
        ...docTransferrSupplyList,
        ...docChangeCategoryList,
      ];

      return res.status(200).json(data);
    } catch (error) {
      logger.error(error);
      return res.status(500).json(error);
    }
  }

};

export default handler;
