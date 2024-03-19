const express = require("express");
const imageUpload = require("../helper/image-upload");
const adminController = require("../controllers/admin");
// const getCsrfToken = require("../middlewares/csrf");
const isAdmin = require("../middlewares/is-admin");
const isModerator = require("../middlewares/is-moderator");
const adminRoutes = express.Router();


adminRoutes.get("/blog/delete/:blogId", isModerator, adminController.get_blog_delete);

adminRoutes.post("/blog/delete/:blogId", isModerator, adminController.post_blog_delete);

adminRoutes.get("/category/delete/:categoryId", isAdmin, adminController.get_category_delete);

adminRoutes.post("/category/delete/:categoryId", isAdmin, adminController.post_category_delete);

adminRoutes.get("/blog/create", isModerator, adminController.get_blog_create);

adminRoutes.post("/blog/create", isModerator, imageUpload.single("resim"), adminController.post_blog_create);

adminRoutes.post("/categories/remove", isAdmin, adminController.post_category_remove);

adminRoutes.get("/category/create", isAdmin, adminController.get_category_create);

adminRoutes.post("/category/create", isAdmin, adminController.post_category_create);

adminRoutes.get("/blogs/:blogId", isModerator, adminController.get_blog_edit);

adminRoutes.post("/blogs/:blogId", isModerator, imageUpload.single("resim"), adminController.post_blog_edit);

adminRoutes.get("/categories/:categoryId", isAdmin, adminController.get_category_edit);

adminRoutes.post("/categories/:categoryId", isAdmin, adminController.post_category_edit);

adminRoutes.get("/blogs", isModerator, adminController.get_blog_list);

adminRoutes.get("/categories", isAdmin, adminController.get_category_list);

adminRoutes.post("/role/remove", isAdmin, adminController.post_role_remove);
adminRoutes.get("/roles/:roleId", isAdmin, adminController.get_role_edit);
adminRoutes.post("/roles/:roleId", isAdmin, adminController.post_role_edit);
adminRoutes.get("/roles", isAdmin, adminController.get_roles);

adminRoutes.get("/users", isAdmin, adminController.get_users);
adminRoutes.get("/user/:userId", isAdmin, adminController.get_user_edit);
adminRoutes.post("/user/:userId", isAdmin, adminController.post_user_edit);

module.exports = adminRoutes;