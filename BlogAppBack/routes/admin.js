const express = require("express");
const adminRoutes = express.Router();
const adminController = require("../controllers/adminController");

adminRoutes.post("/postProduct", adminController.post_product);
adminRoutes.get("/", adminController.get_admin);

module.exports = adminRoutes;