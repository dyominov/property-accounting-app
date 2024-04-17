import path from "path";
import logger from "@/utils/logger";
import { createRouter } from 'next-connect';
import formidable from "formidable";
import fs from "fs";
import { isAuthenticated } from "../../../lib/auth";

const SCAN_FOLDER = process.env.SCANS;

/**
 * @swagger
 * /api/POST/upload-scan:
 *   post:
 *     summary: Upload scan image
 *     description: Upload scan image to server
 *     security:
 *       - BearerAuth: [bearer]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "./schemas/api-post-uploadScan/requestBody.yaml#/RequestBody"
 *           examples:
 *             default:
 *               $ref: ./schemas/api-post-uploadScan/requestBody-example.yaml
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                filename:
 *                  type: string
 *                  example: scan_56.jpeg
 *       401:
 *        description: Unauthorized
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *                 example: 401
 *       405:
 *         description: Method not allowed
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *       501:
 *         description: Internal Error
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Wrong query to database
 */

export const config = {
  api: {
    bodyParser: false
  }
};

const router = createRouter();

const saveFile = async (file, operation, documentTitle) => {
  const data = fs.readFileSync(file.filepath);
  const { ext } = path.parse(file.originalFilename);
  const dir = `${SCAN_FOLDER}/${operation}/${documentTitle}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(`${dir}/${file.newFilename}${ext}`, data);
  await fs.unlinkSync(file.filepath);

  return `${file.newFilename}${ext}`;
};

router.post(async (req, res) => {
  const isUserAuthenticated = await isAuthenticated(req);
  if (!isUserAuthenticated) {
    return res.status(401).json({ status: 401 });
  }
  const form = new formidable.IncomingForm();

  form.parse(req, async function (err, fields, files) {
    const { operation, documentTitle } = fields;
    const filename = await saveFile(files.file, operation, documentTitle);

    return res.status(200).json(filename);
  });
});

export default router.handler({
  onError(error, req, res) {
    logger.error(error);
    res.status(501).json({ message: error.message });
  },
  onNoMatch(req, res) {
    logger.error(`Method '${req.method}' Not Allowed`);
    res.status(405).json({ message: `Method '${req.method}' Not Allowed` });
  },
});

