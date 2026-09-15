import { db } from "../prisma/db.js";

export async function listManagers() {
  return db.orm.public.User
    .where({
      role: "GESTOR",
    })
    .select(
      "id",
      "name",
      "email",
      "role",
    )
    .orderBy([
      (user) => user.name.asc(),
      (user) => user.id.asc(),
    ])
    .all();
}
