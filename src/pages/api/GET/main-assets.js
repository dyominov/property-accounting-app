import { getToken } from "next-auth/jwt";
import prisma from "@/prisma/client";
import { DocumentStatus, MainAssetStatus } from "@prisma/client";
import logger from "@/utils/logger";
import { isAuthenticated } from "../../../lib/auth";

/**
 * @swagger
 * /api/GET/main-assets:
 *   get:
 *     summary: Returns list of main assets
 *     description: Returns list of main assets
 *     security:
 *       - BearerAuth: [bearer]
 *     parameters:
 *       - name: status
 *         in: query
 *         description: status or statuses of the main assets to fetch
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
 *                $ref: "./schemas/api-get-main-assets.yaml#/MainAsset"
 */
const handler = async (req, res) => {
  const isUserAuthenticated = await isAuthenticated(req);
  if (!isUserAuthenticated) {
    return res.status(401).end();
  }

  if (req.method === 'GET') {
    const { query } = req;

    try {
      const mainAssetQuery = {
        include: { group: true, category: true, integer: true }
      };

      if (Object.keys(query).length > 0) {
        mainAssetQuery.where = {};
        // check query params
        if (query.status) {
          const queryStatuses = query.status;

          if (Array.isArray(queryStatuses)) {
            const statuses = queryStatuses.map(qs => {
              switch (qs) {
                case 'MOVED':
                  return MainAssetStatus.MOVED;
                case 'OWNED':
                  return MainAssetStatus.OWNED;
                case 'PINNED':
                  return MainAssetStatus.PINNED;
                case 'UNDEFINED':
                  return MainAssetStatus.UNDEFINED;
              }
            });

            mainAssetQuery.where.status = {
              in: statuses
            };
          } else {
            let status;
            switch (queryStatuses) {
              case 'MOVED':
                status = MainAssetStatus.MOVED;
                break;
              case 'OWNED':
                status = MainAssetStatus.OWNED;
                break;
              case 'PINNED':
                status = MainAssetStatus.PINNED;
                break;
              case 'UNDEFINED':
                status = MainAssetStatus.UNDEFINED;
                break;
            }

            mainAssetQuery.where.status = status;
          }
        }
      }

      const reaized = await prisma.documentAddSupply.findMany({
        where: { status: DocumentStatus.REALIZED },
        include: {
          mainAssets: { ...mainAssetQuery },
        }
      });
      const data = reaized.map(doc => doc.mainAssets).flat();

      return res.status(200).json(data);
    } catch (error) {
      logger.error(error);
      return res.status(500).json(error);
    }
  }

};

export default handler;
