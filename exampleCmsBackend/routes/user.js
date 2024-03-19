const express = require("express");
const userController = require("../controllers/userController");
const userRoutes = express.Router();

userRoutes.get('/products/:prodId', userController.get_product_detail);
userRoutes.get('/products', userController.get_products);
userRoutes.get('/categories', userController.get_categories);

module.exports = userRoutes;
