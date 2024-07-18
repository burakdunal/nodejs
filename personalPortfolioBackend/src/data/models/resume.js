const { DataTypes } = require("sequelize");
const dbConn = require("../database");

const Resume = dbConn.define("resume", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descr: {
        type:DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Resume;