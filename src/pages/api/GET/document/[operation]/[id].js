import prisma from "@/prisma/client";
import logger from "@/utils/logger";
import { isAuthenticated } from "../../../../../lib/auth";

/**
 * @swagger
 * /api/GET/document/{operation}/{id}:
 *   get:
 *     summary: Returns document
 *     security:
 *       - BearerAuth: [bearer]
 *     parameters:
 *       - name: operation
 *         in: path
 *         schema:
 *          type: string
 *         required: true
 *         description: string representation of the operation
 *       - name: id
 *         in: path
 *         schema:
 *          type: integer
 *         required: true
 *         description: Numeric ID of the document to get
 *     responses:
 *       200:
 *         description: A JSON document
 *         content:
 *           application/json:
 *             schema: 
 *               oneOf:
 *                 - $ref: "./schemas/api-get-document-{operation}-{id}/responses/addSupply-realized.yaml#/Document"
 *                 - $ref: "./schemas/api-get-document-{operation}-{id}/responses/addSupply-notRealized.yaml#/Document"
 *                 - $ref: "./schemas/api-get-document-{operation}-{id}/responses/pinMainAsset-realized.yaml#/Document"
 *                 - $ref: "./schemas/api-get-document-{operation}-{id}/responses/pinMainAsset-notRealized.yaml#/Document"
 */
const handler = async (req, res) => {
  const isUserAuthenticated = await isAuthenticated(req);
  if (!isUserAuthenticated) {
    return res.status(401).end();
  }

  if (req.method === 'GET') {
    const { operation, id } = req.query;

    try {
      let data = null;

      switch (operation) {
        case 'add-supply':
          data = await prisma.documentAddSupply.findUnique({
            where: { id: Number.parseInt(id) }, select: {
              number: true,
              mainAssets: { include: { group: true, category: true, integer: true } },
              stockpile: { include: { group: true, integer: true } },
              type: { include: { docType: true, } },
              creator: { select: { name: true } },
              realizator: { select: { name: true } },
              status: true,
              scans: true,
              createdAt: true,
              realizedAt: true,
            }
          });
          break;

        case 'pin-ma':
          data = await prisma.documentPinMainAsset.findUnique({
            where: { id: Number.parseInt(id) }, select: {
              number: true,
              mainAssets: { include: { group: true, category: true, integer: true } },
              type: { include: { docType: true, } },
              creator: { select: { name: true } },
              realizator: { select: { name: true } },
              status: true,
              holder: { include: { notSystemUnit: true } },
              scans: true,
              createdAt: true,
              realizedAt: true,
            }
          });
          break;
        case 'transfer-supply':
          data = await prisma.documentTransferSupply.findUnique({
            where: { id: Number.parseInt(id) }, select: {
              number: true,
              mainAssets: { include: { group: true, category: true, integer: true } },
              stockpile: { include: { parent: { include: { group: true, integer: true } } } },
              type: { include: { docType: true, } },
              creator: { select: { name: true } },
              realizator: { select: { name: true } },
              status: true,
              holder: { include: { notSystemUnit: true } },
              scans: true,
              createdAt: true,
              realizedAt: true,
            }
          });
          break;
        case 'change-ma-category':
          data = await prisma.documentChangeCategory.findUnique({
            where: { id: Number.parseInt(id) }, select: {
              number: true,
              mainAssets: { include: { group: true, category: true, integer: true } },
              type: { include: { docType: true, } },
              creator: { select: { name: true } },
              realizator: { select: { name: true } },
              status: true,
              category: true,
              scans: true,
              createdAt: true,
              realizedAt: true,
            }
          });
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
