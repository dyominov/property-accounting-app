import prisma from "@/prisma/client";
import logger from "@/utils/logger";
import { isAuthenticated } from "../../../lib/auth";

/**
 * @swagger
 * /api/GET/categories:
 *   get:
 *     summary: Returns list of categories
 *     description: Returns list of all categories of main assets registered in app
 *     security:
 *       - BearerAuth: [bearer]
 *     responses:
 *       200:
 *         description: A JSON list of all categories
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "./schemas/dbModels/category.yaml#/Category"
 */
const handler = async (req, res) => {
  const isUserAuthenticated = await isAuthenticated(req);
  if (!isUserAuthenticated) {
    return res.status(401).end();
  }

  if (req.method === 'GET') {
    try {
      const data = await prisma.supplyCategory.findMany();
      return res.status(200).json(data);
    } catch (error) {
      logger.error(error);
      return res.status(500).json(error);
    }
  }

};

export default handler;
