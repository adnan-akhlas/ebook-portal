import { Router } from "express";
import { createUser } from "./users.controller";

const UserRouter = Router();

UserRouter.post("/register", createUser);

export default UserRouter;
