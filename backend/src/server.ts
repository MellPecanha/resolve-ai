import "dotenv/config";
import { app } from "./app.js";
import { ensureOccurrenceImageBucket } from "./services/storage.service.js";

const PORT = 3333;

async function start() {
  await ensureOccurrenceImageBucket();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((error: unknown) => {
  console.error("Unable to initialize object storage:", error);
  process.exit(1);
});
