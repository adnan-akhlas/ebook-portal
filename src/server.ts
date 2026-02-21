import http from "http";
import { Server } from "node:http";
import app from "./app";
import { env } from "./config/env.config";
import connectDB from "./config/db.config";

const port = env.PORT;
let server: Server | null;

const startServer = async () => {
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
  await connectDB();
};

startServer();
