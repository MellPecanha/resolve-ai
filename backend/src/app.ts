import express from "express";
import { authRoutes } from "./routes/auth.routes.js";
import { occurrenceRoutes } from "./routes/occurrence.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Resolve Aí API funcionando!",
  });
});

app.use("/auth", authRoutes);
app.use("/occurrences", occurrenceRoutes);

app.use(errorHandler);

export { app };