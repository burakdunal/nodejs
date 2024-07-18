const express = require("express");
const userController = require("../controllers/userController");
const userRoutes = express.Router();

userRoutes.post('/contact/sent', userController.post_contact_form);
userRoutes.get('/blogs/all', userController.get_blogs_all);
userRoutes.get('/blogs/:url', userController.get_blog_detail);
userRoutes.get('/blogs', userController.get_blogs);
// userRoutes.get('/products', userController.get_products);
// userRoutes.get('/categories', userController.get_categories);

module.exports = userRoutes;
