const { DataTypes } = require("sequelize");
const dbConn = require("../data/database");

const Product = dbConn.define("products", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    descr: {
        type:DataTypes.TEXT,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_actv: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

module.exports = Product;