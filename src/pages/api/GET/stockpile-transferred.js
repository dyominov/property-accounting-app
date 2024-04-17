import prisma from "@/prisma/client";
import { DocumentStatus } from "@prisma/client";
import logger from "@/utils/logger";
import { isAuthenticated } from "../../../lib/auth";

/**
 * @swagger
 * /api/GET/transferred-stockpile:
 *   get:
 *     summary: Returns list of transferred stockpile
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
      const data = await prisma.documentTransferSupply.findMany({ where: { status: DocumentStatus.REALIZED }, include: { 
        stockpile: { include: { parent: { include: { group: true, integer: true }} }} }});

      return res.status(200).json(data);
    } catch (error) {
      logger.error(error);
      return res.status(500).json(error);
    }
  }

};

export default handler;
