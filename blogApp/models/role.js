const { DataTypes } = require("sequelize");
const dbconn = require("../data/database");

const Role = dbconn.define("role", {
    rolename: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Role;