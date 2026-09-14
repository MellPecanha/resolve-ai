import "dotenv/config";
import { beforeAll } from "vitest";
import { db } from "../prisma/db.js";

beforeAll(async () => {
  await db.connect();
});
