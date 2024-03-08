const express = require("express");
const userController = require("../controllers/userController");
const userRoutes = express.Router();

userRoutes.get('/products/getProduct', userController.get_product_detail);
userRoutes.get('/products', userController.get_products);

module.exports = userRoutes;
