const express = require("express");
const userRoutes = express.Router();
const userController = require("../controllers/userController");

userRoutes.get("/", userController.get_index);

userRoutes.get("/blogs/:blogId", userController.get_blog_details);

module.exports = userRoutes;