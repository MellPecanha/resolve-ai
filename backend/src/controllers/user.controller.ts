import type { Request, Response } from "express";

import { listManagers } from "../services/user.service.js";

export async function getManagers(
  _req: Request,
  res: Response,
) {
  const managers = await listManagers();

  return res.json(managers);
}
