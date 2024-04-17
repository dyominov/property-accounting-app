import { getToken } from "next-auth/jwt";
import qs from 'qs';
import prisma from "@/prisma/client";
import { MainAssetStatus } from "@prisma/client";
import logger from "@/utils/logger";
import { isAuthenticated } from "../../../lib/auth";

/**
 * @swagger
 * /api/GET/main-assets-selected:
 *   get:
 *     summary: Returns list of selected main assets
 *     description: Returns list of selected main assets. If query array is empty, return empty array
 *     security:
 *       - BearerAuth: [bearer]
 *     parameters:
 *       - name: ids
 *         in: query
 *         description: ids of the main assets to fetch.
 *         required: false
 *         schema:
 *          type: string
 *     responses:
 *       200:
 *         description: A JSON list of main assets
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "./schemas/api-get-main-assets-selected.yaml#/MainAsset"
 */
const handler = async (req, res) => {
  const isUserAuthenticated = await isAuthenticated(req);
  if (!isUserAuthenticated) {
    return res.status(401).end();
  }

  if (req.method === 'GET') {
    const { query } = req;

    if (Object.keys(query).length > 0) {
      try {
        const ids = Object.values(query).map(strId => Number.parseInt(strId));
        const data = await prisma.mainAsset.findMany({ where: { id: { in: ids }, status: MainAssetStatus.OWNED, }, include: { group: true, category: true, integer: true } });

        return res.status(200).json(data);
      } catch (error) {
        logger.error(error);
        return res.status(500).json(error);
      }
    } else {
      return res.status(200).json([]);
    }

  }

};

export default handler;
