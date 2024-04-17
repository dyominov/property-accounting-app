import prisma from "@/prisma/client";
import { DocumentStatus } from '@prisma/client';
import logger from "@/utils/logger";
import MainAsset from "../../../../../classes/main-asset";
import Stockpile from "../../../../../classes/stockpile";
import { isAuthenticated } from "../../../../../lib/auth";
import { getToken } from "next-auth/jwt";

/**
 * @swagger
 * /api/POST/document/add-supply/save:
 *   post:
 *     summary: Save document
 *     description: Save document
 *     security:
 *       - BearerAuth: [bearer]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "./schemas/api-post-document-addSupply-save/requestBody.yaml#/DocumentAddSupply"
 *           examples:
 *             default:
 *               $ref: ./schemas/api-post-document-addSupply-save/requestBody-example.yaml
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "./schemas/api-post-document-addSupply-save/response.yaml#/DocumentAddSupply"
 */
const handler = async (req, res) => {
  const isUserAuthenticated = await isAuthenticated(req);
  if (!isUserAuthenticated) {
    return res.status(401).end();
  }

  if (req.method === 'POST') {
    const { header, objects, scans } = req.body;
    const { number, date, type: typeId } = header;
    const token = await getToken({ req });

    try {
      const type = await prisma.documentType.findUnique({ where: { id: typeId } });

      if (type) {
        const mainAssets = objects.filter(item => MainAsset.isMainAsset(item)).map(item => MainAsset.fromString(item).toPOJO());
        const stockpile = objects.filter(item => Stockpile.isStockpile(item)).map(item => Stockpile.fromString(item).toPOJO());

        const mainAssetsQuery = mainAssets.map(item => {
          const { group, category, integer, ...rest } = item;

          let data = {
            ...rest,
            category: { connect: { id: category } },
            integer: { connect: { id: integer } },

          };

          if (group) {
            data.group = {
              connectOrCreate: {
                where: {
                  title: group.title,
                },
                create: {
                  title: group.title,
                }
              }
            };
          }

          return data;
        });

        const stockpileQuery = stockpile.map(item => {
          const { group, integer, ...rest } = item;

          let data = {
            ...rest,
            integer: { connect: { id: integer } },
          };

          if (group) {
            data.group = {
              connectOrCreate: {
                where: {
                  title: group.title,
                },
                create: {
                  title: group.title,
                }
              }
            };
          }

          return data;
        });

        const data = {
          number,
          date,
          status: DocumentStatus.NOT_REALIZED,
          createdAt: new Date().toISOString(),
          type: { connect: { id: typeId } },
          mainAssets: {
            create: [...mainAssetsQuery]
          },
          stockpile: {
            create: [...stockpileQuery]
          },
          scans,
          creator: { connect: { id: token.uid } },
        };

        const document = await prisma.documentAddSupply.create({ data });

        return res.status(200).json(document);
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
