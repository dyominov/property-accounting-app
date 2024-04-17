import qs from 'qs';
import prisma from "@/prisma/client";
import { DocumentStatus, Operation } from "@prisma/client";
import logger from "@/utils/logger";
import { isAuthenticated } from '../../../../lib/auth';

/**
 * @swagger
 * /api/GET/documents/is-realized:
 *   get:
 *     summary: Check selected documents status
 *     description: Check selected documents status. If one of them is realized return true
 *     security:
 *       - BearerAuth: [bearer]
 *     parameters:
 *       - name: ids
 *         in: query
 *         description: ids of the documents to check
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
 *                isRealized: 
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
    const ids = Object.values(qs.parse(query)).reduce((group, doc) => {
      const { id, operation } = doc;
      group[operation] = group[operation] ?? [];
      group[operation].push(id);

      return group;
    }, {});

    if (!ids || Object.keys(ids).length === 0) return res.status(200).json({ isRealized: true });

    try {
      let realized = 0;

      if (ids[Operation.ADD_SUPPLY]) {
        idQuery = {
          id: { in: [...ids[Operation.ADD_SUPPLY].map(idStr => Number.parseInt(idStr))] },
          status: DocumentStatus.REALIZED,
        };

        realized += await prisma.documentAddSupply.count({ where: { ...idQuery } });
      }

      if (ids[Operation.PIN_MAIN_ASSET]) {
        idQuery = {
          id: { in: [...ids[Operation.PIN_MAIN_ASSET].map(idStr => Number.parseInt(idStr))] },
          status: DocumentStatus.REALIZED,
        };

        realized += await prisma.documentPinMainAsset.count({ where: { ...idQuery } });
      }

      if (ids[Operation.TRANSFER_SUPPLY]) {
        idQuery = {
          id: { in: [...ids[Operation.TRANSFER_SUPPLY].map(idStr => Number.parseInt(idStr))] },
          status: DocumentStatus.REALIZED,
        };

        realized += await prisma.documentTransferSupply.count({ where: { ...idQuery } });
      }

      if (ids[Operation.CHANGE_CATEGORY]) {
        idQuery = {
          id: { in: [...ids[Operation.CHANGE_CATEGORY].map(idStr => Number.parseInt(idStr))] },
          status: DocumentStatus.REALIZED,
        };

        realized += await prisma.documentChangeCategory.count({ where: { ...idQuery } });
      }

      return res.status(200).json({ isRealized: realized > 0 });
    } catch (error) {
      logger.error(error);
      return res.status(500).json(error);
    }
  }

};

export default handler;
