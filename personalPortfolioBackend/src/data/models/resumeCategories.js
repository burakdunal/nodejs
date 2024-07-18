const { DataTypes } = require("sequelize");
const dbconn = require("../database");

const ResumeCategories = dbconn.define("resumeCategories", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = ResumeCategories;