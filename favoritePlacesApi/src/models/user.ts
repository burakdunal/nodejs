import { DataTypes } from "sequelize";
import dbConn from "../data/database";
import bcrypt from 'bcrypt';

const User = dbConn.define(
  "user",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Ad boş bırakılamaz.",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Soyad boş bırakılamaz.",
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Kullanıcı adı boş bırakılamaz.",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "e-posta",
        msg: "Eposta daha önceden kayıtlı.",
      },
      validate: {
        notEmpty: {
          msg: "E-posta boş bırakılamaz.",
        },
        isEmail: {
          msg: "E-posta formatı eşleşmiyor.",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Parola boş bırakılamaz",
        },
        len: {
          args: [5, 15],
          msg: "Parola 5 ile 15 karakter arasında olmalıdır.",
        },
      },
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { timestamps: true }
);

User.afterValidate(async (user: any) => {
  user.password = await bcrypt.hash(user.password, 10);
});

export default User;
