import prisma from "@/prisma/client";
import { DocumentStatus, MainAssetStatus, StockpileStatus } from "@prisma/client";
import logger from "@/utils/logger";
import { isAuthenticated } from "../../../../../../lib/auth";
import { getToken } from "next-auth/jwt";

/**
 * @swagger
 * /api/PATCH/document/{operation}/realize/{id}:
 *   patch:
 *     summary: Realize document
 *     description: Realize created earlier document
 *     security:
 *       - BearerAuth: [bearer]
 *     parameters:
 *       - name: operation
 *         in: path
 *         schema:
 *          type: string
 *         required: true
 *         description: string representation of the operation
 *       - name: id
 *         in: path
 *         schema:
 *          type: integer
 *         required: true
 *         description: Numeric ID of the document to patch
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
    const { operation, id } = req.query;
    const token = await getToken({ req });

    try {
      let data = {
        realizedAt: new Date(),
        status: DocumentStatus.REALIZED,
        realizatorId: token.uid,
      };

      switch (operation) {
        case 'add-supply':
          await prisma.documentAddSupply.update({ where: { id: Number.parseInt(id) }, data });
          break;
        case 'pin-ma':
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
        case 'transfer-supply':
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

          await prisma.documentTransferSupply.update({ where: { id: Number.parseInt(id) }, data });
          break;

        case 'change-ma-category':
          data.mainAssets = {
            updateMany: {
              where: {
                status: MainAssetStatus.UNDEFINED,
              },
              data: {
                status: MainAssetStatus.OWNED,
              }
            }
          };

          await prisma.documentChangeCategory.update({ where: { id: Number.parseInt(id) }, data });
          break;

        default:
          break;
      }

      return res.status(200).json({ status: 200});
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
