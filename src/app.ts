import express from "express";

const app = express();

app.get("/", (req, res): void => {
  res.json({ message: "Welcome to Ebook Portal api" });
});

export default app;
