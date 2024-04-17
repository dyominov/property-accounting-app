import prisma from "@/prisma/client";
import { DocumentStatus } from "@prisma/client";
import logger from "@/utils/logger";
import { isAuthenticated } from "../../../../lib/auth";

/**
 * @swagger
 * /api/GET/stockpile-transferred/amounts:
 *   get:
 *     summary: Returns list of amounts of transferred stockpile
 *     description: Returns list of amounts of transferred stockpile
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
      // const data = await prisma.transferredStockpile.findMany({ include: { parent: { include: { group: true, integer: true }} }});
      // const data = transferredStockpile.map(tr => tr.parent).flat();

      const documents = await prisma.documentTransferSupply.findMany({ where: { status: DocumentStatus.REALIZED }, select: { stockpile: { select: { parentId: true, amount: true} } } });
      const data = documents.map((doc => {
        return doc.stockpile.map(spl => {
          return {
            stockpileId: spl.parentId,
            amount: spl.amount,
          };
        });
      })).flat().reduce((list, record) => {
        const { stockpileId, amount } = record;
        const idx = list.findIndex((item => item.stockpileId === stockpileId));

        if (idx > -1) {
          list[idx].amount += amount;
        } else {
          list.push({
            stockpileId,
            amount
          });
        }

        return list;
      }, []);

      return res.status(200).json(data);
    } catch (error) {
      logger.error(error);
      return res.status(500).json(error);
    }
  }

};

export default handler;
