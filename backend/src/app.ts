import express from "express";

import { authRoutes } from "./routes/auth.routes.js";
import { occurrenceRoutes } from "./routes/occurrence.routes.js";
import { dashboardRoutes } from './routes/dashboard.routes.js';
import { userRoutes } from "./routes/user.routes.js";
import { uploadRoutes } from "./routes/upload.routes.js";

import { errorHandler } from "./middlewares/error.middleware.js";

import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Resolve Aí API funcionando!",
  });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/occurrences", occurrenceRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/uploads", uploadRoutes);

app.use(errorHandler);

export { app };
