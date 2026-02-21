import { Router } from "express";
import { login, registerUser } from "./users.controller";

const UserRouter = Router();

UserRouter.post("/register", registerUser);
UserRouter.post("/login", login);

export default UserRouter;
