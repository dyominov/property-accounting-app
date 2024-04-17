import prisma from "@/prisma/client";
import logger from "@/utils/logger";
import { isAuthenticated } from "../../../../../lib/auth";

/**
 * @swagger
 * /api/GET/document/type/{id}:
 *   get:
 *     summary: Returns document AllowedDocTypeToOperation type entity by Id
 *     security:
 *       - BearerAuth: [bearer]
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *          type: integer
 *         required: true
 *         description: Numeric ID of the document AllowedDocTypeToOperation type entity to get
 *     responses:
 *       200:
 *         description: A JSON document AllowedDocTypeToOperation type entity
 *         content:
 *           application/json:
 *             schema: 
 *               $ref: "./schemas/dbModels/allowedType.yaml#/AllowedType"
 */
const handler = async (req, res) => {
  const isUserAuthenticated = await isAuthenticated(req);
  if (!isUserAuthenticated) {
    return res.status(401).end();
  }

  if (req.method === 'GET') {
    const { id } = req.query;

    try {
      const data = await prisma.allowedDocTypeToOperation.findUnique({ where: { id: Number.parseInt(id) }, select: { docType: true } });
      return res.status(200).json(data.docType);
    } catch (error) {
      logger.error(error);
      return res.status(500).json(error);
    }
  }

};

export default handler;
