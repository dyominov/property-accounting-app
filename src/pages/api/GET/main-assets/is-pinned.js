import qs from 'qs';
import prisma from "@/prisma/client";
import { MainAssetStatus } from "@prisma/client";
import logger from "@/utils/logger";
import { isAuthenticated } from '../../../../lib/auth';

/**
 * @swagger
 * /api/GET/main-assets/is-pinned:
 *   get:
 *     summary: Check selected main assets status
 *     description: Check selected main assets status. If one of them is pinned return true
 *     security:
 *       - BearerAuth: [bearer]
 *     parameters:
 *       - name: ids
 *         in: query
 *         description: ids of the main assets to check
 *         required: false
 *         schema:
 *          type: string
 *     responses:
 *       200:
 *         description: A JSON that contains boolean value
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              title: 'IsPinned'
 *              properties:
 *                isPinned: 
 *                  type: boolean
 */
const handler = async (req, res) => {
  const isUserAuthenticated = await isAuthenticated(req);
  if (!isUserAuthenticated) {
    return res.status(401).end();
  }

  if (req.method === 'GET') {
    const { query } = req;

    let idQuery = {};
    const ids = Object.values(qs.parse(query));

    if (!ids || ids.length === 0) return res.status(200).json({ isPinned: true });

    try {
      idQuery = {
        id: { in: [...ids.map(idStr => Number.parseInt(idStr))] },
        status: MainAssetStatus.PINNED,
      };

      const pinned = await prisma.mainAsset.count({ where: { ...idQuery } });

      return res.status(200).json({ isPinned: pinned > 0 });
    } catch (error) {
      logger.error(error);
      return res.status(500).json(error);
    }
  }

};

export default handler;
