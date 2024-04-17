import prisma from "@/prisma/client";
import logger from "@/utils/logger";
import { isAuthenticated } from "../../../../../../lib/auth";

/**
 * @swagger
 * /api/GET/document/{operation}/{id}/scans:
 *   get:
 *     summary: Returns list of scan filenames
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
 *         description: Numeric ID of the document to get
 *     responses:
 *       200:
 *         description: A JSON document
 *         content:
 *           application/json:
 *             schema: 
 *               type: array
 *               title: 'ScanList'
 *               items:
 *                  type: string
 */
const handler = async (req, res) => {
  const isUserAuthenticated = await isAuthenticated(req);
  if (!isUserAuthenticated) {
    return res.status(401).end();
  }

  if (req.method === 'GET') {
    const { operation, id } = req.query;

    try {
      let data = null;

      switch (operation) {
        case 'add-supply':
          data = await prisma.documentAddSupply.findUnique({
            where: { id: Number.parseInt(id) }, select: {
              scans: true,
            }
          });
          break;

        case 'pin-ma':
          data = await prisma.documentPinMainAsset.findUnique({
            where: { id: Number.parseInt(id) }, select: {
              scans: true,
            }
          });
          break;
        case 'transfer-supply':
          data = await prisma.documentTransferSupply.findUnique({
            where: { id: Number.parseInt(id) }, select: {
              scans: true,
            }
          });
          break;
        case 'change-ma-category':
          data = await prisma.documentChangeCategory.findUnique({
            where: { id: Number.parseInt(id) }, select: {
              scans: true,
            }
          });
          break;

        default:
          break;
      }

      return res.status(200).json(data.scans);
    } catch (error) {
      logger.error(error);
      return res.status(500).json(error);
    }
  }
};

export default handler;
