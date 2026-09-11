import type { SignOptions } from "jsonwebtoken";

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: "1d" as SignOptions["expiresIn"],
};