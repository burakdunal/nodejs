import userController from "../controllers/userController";
import express, { Request, Response, NextFunction } from "express";

const userRoutes = express.Router();

userRoutes.get(
  "/profile",
  (req: Request, res: Response, next: NextFunction) => {
    userController.get_profile(req, res, next);
  }
);

export default userRoutes;
