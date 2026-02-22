import { Router } from "express";
import UserRouter from "../modules/users/users.router";
import BookRouter from "../modules/books/books.router";

interface IModuleRoute {
  path: string;
  router: Router;
}

const router = Router();

const moduleRoutes: IModuleRoute[] = [
  {
    path: "/users",
    router: UserRouter,
  },
  {
    path: "/books",
    router: BookRouter,
  },
];

moduleRoutes.forEach((module: IModuleRoute) => {
  router.use(module.path, module.router);
});

export default router;
