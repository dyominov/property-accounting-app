import prisma from "@/prisma/client";
import logger from "@/utils/logger";
import { isAuthenticated } from "../../../../lib/auth";

/**
 * @swagger
 * /api/GET/document/pin-ma:
 *   get:
 *     summary: Returns document PinMainAsset by type, number and date
 *     description: Returns document PinMainAsset by type, number and date or null
 *     security:
 *       - BearerAuth: [bearer]
 *     parameters:
 *       - name: type
 *         in: query
 *         description: allowedDocTypeToOperation id
 *         required: true
 *         schema:
 *          type: string
 *       - name: number
 *         in: query
 *         description: document number
 *         required: true
 *         schema:
 *          type: string
 *       - name: date
 *         in: query
 *         description: document date
 *         required: true
 *         schema:
 *          type: string
 *     responses:
 *       200:
 *         description: A JSON document PinMainAsset
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "./schemas/api-get-document-pinma.yaml#/DocumentPinMainAsset"
 */
const handler = async (req, res) => {
  const isUserAuthenticated = await isAuthenticated(req);
  if (!isUserAuthenticated) {
    return res.status(401).end();
  }

  if (req.method === 'GET') {
    const { type, number, date } = req.query;
    try {
      const data = await prisma.documentPinMainAsset.findUnique({
        where: {
          typeId_number_date: {
            typeId: Number.parseInt(type),
            number,
            date,
          }
        },
        include: {
          type: true
        }
      });

      return res.status(200).json(data);
    } catch (error) {
      logger.error(error);
      return res.status(500).json(error);
    }
  }

};

export default handler;
