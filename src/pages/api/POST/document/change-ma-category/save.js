import prisma from "@/prisma/client";
import { DocumentStatus, MainAssetStatus, StockpileStatus } from '@prisma/client';
import logger from "@/utils/logger";
import { isAuthenticated } from "../../../../../lib/auth";
import { getToken } from "next-auth/jwt";

/**
 * @swagger
 * /api/POST/document/change-ma-category/save:
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
    const { header, category, mainAssets, scans } = req.body;
    const { number, date, type: typeId } = header;
    const token = await getToken({ req });

    try {
      const type = await prisma.allowedDocTypeToOperation.findUnique({ where: { id: typeId } });

      if (type) {
        const mainAssetsQuery = {
          connect: mainAssets.map(id => ({ id })),
        };

        const data = {
          number,
          date,
          status: DocumentStatus.NOT_REALIZED,
          createdAt: new Date().toISOString(),
          type: { connect: { id: typeId } },
          mainAssets: { ...mainAssetsQuery },
          category: { connect: { id: category } },
          creator: { connect: { id: token.uid } },
          scans,
        };

        const dataUpdateMA = {
          mainAssets: {
            updateMany: {
              where: { id: { in: mainAssets }},
              data: {
                categoryId: category 
              },
            }
          }
        };        

        const document = await prisma.documentChangeCategory.create({ data });
        const updatedDocument = await prisma.documentChangeCategory.update({ where: { id: document.id }, data: { ...dataUpdateMA }, include: { mainAssets: true } });

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
