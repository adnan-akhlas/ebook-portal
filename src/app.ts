import express from "express";
import { globalError } from "./middleware/globalError.middleware";
import createHttpError from "http-errors";

const app = express();

// Get - Health check route to confirm server is running
app.get("/", (req, res): void => {
  const error = createHttpError(403, "access forbidden");
  throw error;
  res.json({ message: "Welcome to Ebook Portal api" });
});

// Global Error Handler
app.use(globalError);

export default app;
