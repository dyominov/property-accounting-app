import fs from "fs";
import path from "path";
import mime from 'mime';
import moment from 'moment';
import prisma from "@/prisma/client";
import logger from "@/utils/logger";
import { Operation } from "@prisma/client";
import { isAuthenticated } from "../../../../../../../lib/auth";

const DATE_FORMAT = process.env.DATE_FORMAT;
const SCAN_FOLDER = process.env.SCANS;

/**
 * @swagger
 * /api/GET/document/{operation}/{id}/scan/{filename}:
 *   get:
 *     summary: Returns list of scan filenames
 *     security:
 *       - BearerAuth: [bearer]
 *     headers:
 *       X-Content-Type-Options:
 *         description: response HTTP header is a marker used by the server to indicate that the MIME types advertised in the Content-Type headers should be followed and not be changed. The header allows you to avoid MIME type sniffing by saying that the MIME types are deliberately configured.
 *         schema:
 *           type: string
 *       Accept-Ranges:
 *         description: HTTP response header is a marker used by the server to advertise its support for partial requests from the client for file downloads
 *         schema:
 *           type: string
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
 *       - name: filename
 *         in: path
 *         schema:
 *          type: string
 *         required: true
 *         description: Filename of scan image of the document to get
 *     responses:
 *       200:
 *         description: A JSON document
 *         content:
 *           image/*:
 *             schema: 
 *               type: string
 *               format: binary
 */
const handler = async (req, res) => {
  const isUserAuthenticated = await isAuthenticated(req);
  if (!isUserAuthenticated) {
    return res.status(401).end();
  }

  if (req.method === 'GET') {
    res;
    try {
      const { operation: operationURL, id, filename } = req.query;
      const docQuery = {
        where: { id: Number.parseInt(id) }, select: {
          number: true,
          type: { select: { docType: { select: { title: true } }, } },
          date: true,
        }
      };

      let operation = null;
      let document = null;

      switch (operationURL) {
        case 'add-supply':
          operation = Operation.ADD_SUPPLY;
          document = await prisma.documentAddSupply.findUnique(docQuery);
          break;
        case 'pin-ma':
          operation = Operation.PIN_MAIN_ASSET;
          document = await prisma.documentPinMainAsset.findUnique(docQuery);
          break;
        case 'transfer-supply':
          operation = Operation.TRANSFER_SUPPLY;
          document = await prisma.documentTransferSupply.findUnique(docQuery);
          break;
        case 'change-ma-category':
          operation = Operation.CHANGE_CATEGORY;
          document = await prisma.documentChangeCategory.findUnique(docQuery);
          break;
        default:
          break;
      }

      const documentTitle = `/${document.type.docType.title} ${document.number ? `№ ${document.number}` : ''} від ${moment(document.date).format(DATE_FORMAT)}`;
      const directoryPath = path.join(SCAN_FOLDER, operation, documentTitle);

      const file = fs.readFileSync(path.join(directoryPath, filename));
      const mimeType = mime.getType(filename);

      res.setHeader('Content-Type', mimeType);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Accept-Ranges', 'bytes');

      return res.status(200).send(file);
    } catch (error) {
      logger.error(error);
      return res.status(500).json(error);
    }
  }
};

export default handler;
