import express from "express";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import prisma from "./config/prisma.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";
import { notFound } from "./middleware/notFound.js";
import mahasiswaRoutes from "./routes/mahasiswa.routes.js";
import { sendSuccess } from "./utils/response.js";

const app = express();
const publicDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "../public");

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDirectory));

app.get("/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  sendSuccess(res, 200, "Server dan database berjalan dengan baik");
});

app.use("/mahasiswa", mahasiswaRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
