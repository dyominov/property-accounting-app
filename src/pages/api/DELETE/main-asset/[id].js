import prisma from "@/prisma/client";
import logger from "@/utils/logger";
import { isAuthenticated } from "../../../../lib/auth";

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 * /api/DELETE/main-asset/{id}:
 *   delete:
 *     summary: Delete selected main asset
 *     security:
 *       - BearerAuth: [bearer]
 *     description: Delete selected main asset
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id of the main asset to delete
 *         required: true
 *         schema:
 *          type: string
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
 *       401:
 *         description: Unauthorized
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: integer
 *                  example: 401
 *       500:
 *         description: Internal Error
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: integer
 *                  example: 500
 *                message:
 *                  type: string
 *                  example: Wrong query to database
 */
const handler = async (req, res) => {
  const isUserAuthenticated = await isAuthenticated(req);
  if (!isUserAuthenticated) {
    return res.status(401).json({ status: 401 });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;

    try {
      const data = await prisma.mainAsset.delete({ where: { id: Number.parseInt(id) } });
      return res.status(200).json({status: 200});
    } catch (error) {
      logger.error(error);
      return res.status(500).json({
        status: 500,
        message: error.message
      });
    }
  }

};

export default handler;
