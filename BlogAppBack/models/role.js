const { DataTypes } = require("sequelize");
const dbConn = require("../data/database");

const Role = dbConn.define("role", {
    rolename: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Role;