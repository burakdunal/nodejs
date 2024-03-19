const { DataTypes } = require("sequelize");
const dbconn = require("../data/database");

const Category = dbconn.define("category", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descr: {
        type:DataTypes.TEXT,
        allowNull: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Category;