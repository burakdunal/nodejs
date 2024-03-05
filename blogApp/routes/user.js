const express = require("express");
const userController = require("../controllers/user");
// const getCsrfToken = require("../middlewares/csrf");
const userRoutes = express.Router();

userRoutes.get("/blogs/category/:slug/pages/:pageNumber", userController.blog_list);
userRoutes.get("/blogs/category/:slug/", userController.blog_list);
userRoutes.get("/blogs/pages/:pageNumber", userController.blog_list);
userRoutes.get("/blogs/:slug", userController.blog_details);
userRoutes.get("/blogs", userController.blog_list);
userRoutes.get("/", userController.index);

module.exports = userRoutes;