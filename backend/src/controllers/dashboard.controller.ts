import type {
  Request,
  Response,
} from "express";

import { getDashboard } from "../services/dashboard.service.js";

export async function dashboard(
  _req: Request,
  res: Response,
) {
  const result = await getDashboard();

  return res.json(result);
}
