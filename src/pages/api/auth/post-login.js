/* eslint-disable jsdoc/no-missing-syntax */
import prisma from "@/prisma/client";
import logger from "@/utils/logger";

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const query = { where: { ...req.body } };
      const data = await prisma.user.findFirst(query);

      return res.status(200).json(data);
    } catch (error) {
      logger.error(error);
      return res.status(500).json(error);
    }
  }
};

export default handler;
