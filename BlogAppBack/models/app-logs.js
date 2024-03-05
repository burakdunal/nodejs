const { DataTypes } = require("sequelize");
const dbConn = require("../data/database");

const AppLogs = dbConn.define("app_logs", {
    level: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    meta: {
        type: DataTypes.JSON,
        allowNull: true
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
});

module.exports = AppLogs;