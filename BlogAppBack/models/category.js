const { DataTypes } = require("sequelize");
const dbConn = require("../data/database");

const Category = dbConn.define("category", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Category;