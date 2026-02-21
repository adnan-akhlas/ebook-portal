import express from "express";
import globalError from "./middleware/globalError.middleware";
import UserRouter from "./modules/users/users.router";
import httpStatus from "http-status-codes";

const app = express();
app.use(express.json());
app.use("/api/users", UserRouter);

// Get - Health check route to confirm server is running
app.get("/", (req, res): void => {
  res.json({ message: "Welcome to Ebook Portal api." });
});

// Global Error Handler
app.use(globalError);

app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    route: req.url,
    message: "Requested route not found.",
  });
});

export default app;
