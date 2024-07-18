const { DataTypes } = require("sequelize");
const dbConn = require("../database");

const Contact = dbConn.define("contact", {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type:DataTypes.TEXT,
        allowNull: false
    },
});

module.exports = Contact;