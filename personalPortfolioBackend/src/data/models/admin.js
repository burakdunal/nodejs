const { DataTypes } = require("sequelize");
const dbConn = require("../database");
const bcrypt = require("bcrypt");

const Admin = dbConn.define("admin", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Parola boş bırakılamaz",
      },
      len: {
        args: [5, 10],
        msg: "Parola 5 ile 10 karakter arasında olmalıdır.",
      },
    },
  },
});

Admin.afterValidate(async(admin) => {
  admin.password = await bcrypt.hash(admin.password, 10);
});

module.exports = Admin;