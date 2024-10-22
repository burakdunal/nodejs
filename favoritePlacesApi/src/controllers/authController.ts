import { Request, Response, NextFunction } from "express";
import { registerUserData } from "../types/userTypes";

const post_register = (req: Request, res: Response, next: NextFunction) => {
  const userData: registerUserData = {
    name: req.body.name,
    surname: req.body.surname,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  console.log(userData);
  res.status(200).send("Başarılı");
};

export default {
  post_register,
};
