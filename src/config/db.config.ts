import { connection, connect } from "mongoose";
import env from "./env.config";

const connectDB = async (): Promise<void> => {
  try {
    connection.on("connected", () => {
      console.log("✅ Connected to database successfully.");
    });
    connection.on("error", (err) => {
      console.log("❌ Error occured on mongo: ", err);
    });
    await connect(env.MONGO_URI);
  } catch (error: unknown) {
    console.error("❌ Failed to connect mongo: ", error);
    process.exit(1);
  }
};

export default connectDB;
