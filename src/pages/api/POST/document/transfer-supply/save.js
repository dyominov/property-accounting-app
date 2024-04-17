import prisma from "@/prisma/client";
import { DocumentStatus, MainAssetStatus, StockpileStatus } from '@prisma/client';
import logger from "@/utils/logger";
import { isAuthenticated } from "../../../../../lib/auth";
import { getToken } from "next-auth/jwt";

/**
 * @swagger
 * /api/POST/document/pin-ma/save:
 *   post:
 *     summary: Save document
 *     description: Save document
 *     security:
 *       - BearerAuth: [bearer]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "./schemas/api-post-document-pinMainAsset-save/requestBody.yaml#/DocumentPinMainAsset"
 *           examples:
 *             default:
 *               $ref: ./schemas/api-post-document-pinMainAsset-save/requestBody-example.yaml
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "./schemas/api-post-document-pinMainAsset-save/response.yaml#/DocumentPinMainAsset"
 */
const handler = async (req, res) => {
  const isUserAuthenticated = await isAuthenticated(req);
  if (!isUserAuthenticated) {
    return res.status(401).end();
  }

  if (req.method === 'POST') {
    const { header, holder, mainAssets, stockpile, scans } = req.body;
    const { number, date, type: typeId } = header;
    const token = await getToken({ req });

    try {
      const type = await prisma.documentType.findUnique({ where: { id: typeId } });

      if (type) {
        const mainAssetsQuery = {
          connect: mainAssets.map(id => ({ id })),
        };

        const stockpileQuery = {
          create: Object.keys(stockpile).map(id => ({parentId: Number.parseInt(id), amount: stockpile[id]})),
        };

        const notSystemUnitId = Number.parseInt(holder.notSystemUnit);

        const holderQuery = {
          connectOrCreate: {
            where: {
              name: holder.name,
            },
            create: {
              name: holder.name,
            }
          }
        };

        if (!Number.isNaN(notSystemUnitId)) {
          holderQuery.connectOrCreate.create.notSystemUnit = { connect: { id: notSystemUnitId } };
        }

        const data = {
          number,
          date,
          status: DocumentStatus.NOT_REALIZED,
          createdAt: new Date().toISOString(),
          type: { connect: { id: typeId } },
          mainAssets: { ...mainAssetsQuery },
          stockpile: { ...stockpileQuery },
          creator: { connect: { id: token.uid } },
          holder: { ...holderQuery },
          scans,
        };

        const dataUpdateMA = {
          mainAssets: {
            updateMany: {
              where: {
                status: MainAssetStatus.OWNED,
              },
              data: {
                status: MainAssetStatus.UNDEFINED,
              }
            }
          }
        };
        

        const document = await prisma.documentTransferSupply.create({ data });
        const updatedDocument = await prisma.documentTransferSupply.update({ where: { id: document.id }, data: { ...dataUpdateMA }, include: { mainAssets: true, stockpile: true } });

        return res.status(200).json(updatedDocument);
      } else {
        return res.status(500).json(new Error('Помилка пошуку типу документу'));
      }

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
