import prisma from "@/prisma/client";
import { DocumentStatus, MainAssetStatus, Operation, StockpileStatus } from "@prisma/client";
import logger from "@/utils/logger";
import { isAuthenticated } from "../../../../lib/auth";

const DATE_FORMAT = process.env.DATE_FORMAT;

/**
 * @swagger
 * /api/PATCH/documents/realize:
 *   patch:
 *     summary: Realize documents
 *     description: Realize created earlier documents
 *     security:
 *       - BearerAuth: [bearer]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               id: integer
 *               operation: string
 *           example:
 *             - id: 1
 *               operation: ADD_SUPPLY
 *             - id: 2
 *               operation: ADD_SUPPLY
 *             - id: 5
 *               operation: ADD_SUPPLY
 *             - id: 1
 *               operation: PIN_MAIN_ASSET
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: integer
 *                  example: 200
 */
const handler = async (req, res) => {
  const isUserAuthenticated = await isAuthenticated(req);
  if (!isUserAuthenticated) {
    return res.status(401).end();
  }

  if (req.method === 'PATCH') {
    const { data } = req.body;

    const ids = data.reduce((group, doc) => {
      const { id, operation } = doc;
      group[operation] = group[operation] ?? [];
      group[operation].push(id);

      return group;
    }, {});

    try {
      let data = {
        realizedAt: new Date(),
        status: DocumentStatus.REALIZED,
        realizatorId: token.uid,
      };

      if (ids[Operation.ADD_SUPPLY]) {
        const idQuery = {
          id: { in: [...ids[Operation.ADD_SUPPLY].map(idStr => Number.parseInt(idStr))] }
        };

        await prisma.documentAddSupply.updateMany({ where: { ...idQuery }, data });
      }

      if (ids[Operation.PIN_MAIN_ASSET]) {
        data.mainAssets = {
          updateMany: {
            where: {
              status: MainAssetStatus.UNDEFINED,
            },
            data: {
              status: MainAssetStatus.PINNED,
            }
          }
        };

        const promises = ids[Operation.PIN_MAIN_ASSET]
          .map(idStr => Number.parseInt(idStr))
          .map((id) => {
            return prisma.documentPinMainAsset.update({ where: { id }, data, include: { mainAssets: true } });
          });

        await Promise.all(promises);
      }

      if (ids[Operation.TRANSFER_SUPPLY]) {
        data.mainAssets = {
          updateMany: {
            where: {
              status: MainAssetStatus.UNDEFINED,
            },
            data: {
              status: MainAssetStatus.TRANSFERED,
            }
          }
        };
        data.stockpile = {
          updateMany: {
            where: {
              status: StockpileStatus.UNDEFINED,
            },
            data: {
              status: StockpileStatus.TRANSFERED,
            }
          }
        };

        const promises = ids[Operation.TRANSFER_SUPPLY]
          .map(idStr => Number.parseInt(idStr))
          .map((id) => {
            return prisma.documentTransferSupply.update({ where: { id }, data, include: { mainAssets: true, stockpile: true } });
          });

        await Promise.all(promises);
      }


      return res.status(200);
    } catch (error) {
      logger.error(error);
      // not unique record
      if (error.code === 'P2002') {
        return res.status(409).json(error);
      }
      return res.status(500).json(error);
    }
  }
};

export default handler;
