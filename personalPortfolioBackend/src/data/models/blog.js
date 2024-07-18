const { DataTypes } = require("sequelize");
const dbConn = require("../database");

const Blog = dbConn.define("blog", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    img: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descr: {
        type:DataTypes.TEXT,
        allowNull: false
    },
    excerpt: {
        type:DataTypes.TEXT,
        allowNull: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = Blog;