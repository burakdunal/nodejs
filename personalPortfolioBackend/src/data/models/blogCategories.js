const { DataTypes } = require("sequelize");
const dbconn = require("../database");

const BlogCategories = dbconn.define("blogCategories", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = BlogCategories;