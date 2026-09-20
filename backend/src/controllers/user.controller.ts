import type { Request, Response } from "express";

import {
  updateProfileSchema,
} from "../dtos/user.dto.js";

import {
  listManagers,
  updateProfile,
} from "../services/user.service.js";

export async function getManagers(
  _req: Request,
  res: Response,
) {
  const managers = await listManagers();

  return res.json(managers);
}

export async function updateMyProfile(
  req: Request,
  res: Response,
) {
  const data =
    updateProfileSchema.parse(req.body);

  const user = await updateProfile(
    req.user!.id,
    data,
  );

  return res.json(user);
}
