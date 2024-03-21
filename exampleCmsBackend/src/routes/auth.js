const express = require("express");
const authController = require("../controllers/authController");
// const getCsrfToken = require("../middlewares/csrf");
const authRoutes = express.Router();

authRoutes.get("/register", authController.get_register);
authRoutes.post("/register", authController.post_register);

// authRoutes.get("/login", authController.get_login);
authRoutes.post("/login", authController.post_login);

authRoutes.get("/reset-password", authController.get_reset_pass);
authRoutes.post("/reset-password", authController.post_reset_pass);

authRoutes.get("/new-password/:token", authController.get_new_pass);
authRoutes.post("/new-password", authController.post_new_pass);

// authRoutes.get("/logout", getCsrfToken, authController.get_logout);
authRoutes.get("/logout", authController.get_logout);

authRoutes.get("/check-auth", authController.get_check_auth);

module.exports = authRoutes;