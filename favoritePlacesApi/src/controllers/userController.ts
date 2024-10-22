import { Request, Response, NextFunction } from "express";
import { profileUserData } from "../types/userTypes";
import { Sequelize } from "sequelize";
import User from "../models/user";

const get_profile = async (req: Request, res: Response, next: NextFunction) => {
  const userId = 1;
  try {
    const user = await User.findOne({
      where: {
        id: userId,
      },
      raw: true,
    });

    if (user) {
      return res.send({ title: "User Profile", user });
    }
  } catch (error: any) {
    res.status(500).send("Veri çekme hatası: " + error.message);
  }

  // const profileData: profileUserData = {
  //   name: "Burak",
  //   surname: "Dünal",
  //   username: "burakdunal",
  //   email: "burak@burak.com",
  //   placesCount: 8,
  // };

  // res.status(200).send(profileData);
};

export default {
  get_profile,
};
