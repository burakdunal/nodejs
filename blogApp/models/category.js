const { DataTypes } = require("sequelize");
const dbconn = require("../data/database");

const Category = dbconn.define("category", {
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