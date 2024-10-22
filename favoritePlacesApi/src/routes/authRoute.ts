import express, { Request, Response, NextFunction } from "express";
import authController from "../controllers/authController";

const authRoutes = express.Router();

authRoutes.post(
  "/register",
  (req: Request, res: Response, next: NextFunction) => {
    authController.post_register(req, res, next);
  }
);

export default authRoutes;
