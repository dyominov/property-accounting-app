import logger from "@/utils/logger";
import { getToken } from "next-auth/jwt";

export async function isAuthenticated(req) {
  const token = await getToken({ req });

  if (token) {
    return true;
  } else {
    logger.error("Відсутній токен");
    return false;
  }
}