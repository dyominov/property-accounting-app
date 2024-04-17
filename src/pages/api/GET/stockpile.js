import prisma from "@/prisma/client";
import { DocumentStatus } from "@prisma/client";
import logger from "@/utils/logger";
import { isAuthenticated } from "../../../lib/auth";

/**
 * @swagger
 * /api/GET/stockpile:
 *   get:
 *     summary: Returns list of stockpile
 *     description: Returns list of all stockpile objects
 *     security:
 *       - BearerAuth: [bearer]
 *     responses:
 *       200:
 *         description: A JSON list of all stockpile objects
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "./schemas/api-get-stockpile.yaml#/Stockpile"
 */
const handler = async (req, res) => {
  const isUserAuthenticated = await isAuthenticated(req);
  if (!isUserAuthenticated) {
    return res.status(401).end();
  }

  if (req.method === 'GET') {
    try {
      const reaized = await prisma.documentAddSupply.findMany({ where: { status: DocumentStatus.REALIZED }, include: { stockpile: { include: { group: true, integer: true } } } });
      const data = reaized.map(doc => doc.stockpile).flat();

      return res.status(200).json(data);
    } catch (error) {
      logger.error(error);
      return res.status(500).json(error);
    }
  }

};

export default handler;
