const express = require("express");
const adminRoutes = express.Router();
const adminController = require("../controllers/adminController");
const imageUpload = require("../helper/image-upload");
const isAuth = require("../middlewares/auth");

adminRoutes.post("/products/edit/:prodId", isAuth, imageUpload.single("image"), adminController.post_product_edit);
adminRoutes.post("/products/delete/:prodId", isAuth, adminController.post_product_delete);
adminRoutes.post("/products/create", isAuth, imageUpload.single("image"), adminController.post_product_create);
adminRoutes.get("/products/:prodId", adminController.get_product_detail);
adminRoutes.post("/postProductTest", isAuth, adminController.post_product_test);
adminRoutes.get("/categories", adminController.get_categories);
adminRoutes.get("/", adminController.get_admin);

module.exports = adminRoutes;