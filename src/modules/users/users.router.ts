import { Router } from "express";
import { registerUser } from "./users.controller";

const UserRouter = Router();

UserRouter.post("/register", registerUser);

export default UserRouter;
