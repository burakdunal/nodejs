const express = require("express");
const adminRoutes = express.Router();
const adminController = require("../controllers/adminController");
const imageUpload = require("../helper/image-upload");
const isAuth = require("../middlewares/auth");

adminRoutes.post("/products/edit/:prodId", isAuth, imageUpload.single("image"), adminController.post_product_edit);
adminRoutes.post("/products/delete/:prodId", isAuth, adminController.post_product_delete);
adminRoutes.post("/categories/delete/:categoryId", isAuth, adminController.post_category_delete);
adminRoutes.get("/categories/delete/:categoryId", isAuth, adminController.get_category_delete);
adminRoutes.post("/products/create", isAuth, imageUpload.single("image"), adminController.post_product_create);
adminRoutes.post("/categories/create", isAuth, imageUpload.single("image"), adminController.post_category_create);
adminRoutes.get("/products/:prodId", adminController.get_product_detail);
adminRoutes.get("/categories/:categoryId", adminController.get_category_detail);
adminRoutes.get("/categories", adminController.get_categories);
adminRoutes.post("/postProductTest", isAuth, adminController.post_product_test);
adminRoutes.get("/", adminController.get_admin);

module.exports = adminRoutes;