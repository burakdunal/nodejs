const Category = require("../models/category");
const Blog = require("../models/blog");
const Role = require("../models/role");
const User = require("../models/user");
const fs = require("fs");
const { Op } = require("sequelize");
const dbconn = require("../data/database");
const slugField = require("../helper/slugfield");

exports.get_blog_delete = async(req, resp) => {
    const blogId = req.params.blogId;
    const userId = req.session.userId;
    const isAdmin = req.session.roles.includes("admin");
    try{
        // const {rows: blog} = await dbconn.query("select * from blog where id=$1",[blogId]);
        const blog = await Blog.findOne({ 
            where: isAdmin ? {id: blogId } : {id: blogId, userId: userId }
        });
        if (blog){
            return resp.render("admin/blog-delete", {
                title: "Delete Blog",
                blog: blog
            });
        }
        resp.redirect("/admin/blogs");
    }
    catch(err){
        console.log("Veri çekme hatası: " + err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};

exports.post_blog_delete = async(req, resp) => {
    const blogId = req.body.blogId;
    try{
        const blog = await Blog.findByPk(blogId);
        if (blog){
            blog.destroy();
            return resp.redirect("/admin/blogs?action=delete");
        }
        resp.redirect("/admin/blogs");
    }
    catch(err){
        console.log("Veri çekme hatası: " + err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};

exports.get_category_delete = async(req, resp) => {
    const categoryId = req.params.categoryId;

    try{
        const category = await Category.findByPk(categoryId);
        if (category){
            return resp.render("admin/category-delete", {
                title: "Delete Category",
                category: category
            });
        }
        resp.redirect("/admin/categories");
    }
    catch(err){
        console.log("Veri çekme hatası: " + err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};

exports.post_category_delete = async(req, resp) => {
    const categoryId = req.body.categoryId;
    try{
        const category = await Category.findByPk(categoryId);
        if (category){
            await category.destroy();
            return resp.redirect("/admin/categories?action=delete");
        }
        resp.redirect("admin/categories");
    }
    catch(err){
        console.log("Veri çekme hatası: " + err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};

exports.get_blog_create = async(req, resp) => {
    try{
        // const {rows: categories} = await dbconn.query("select * from category order by 1");
        const categories = await Category.findAll();
        resp.render("admin/blog-create", {
            title: "add blog",
            categories: categories
        });
    }
    catch(err){
        console.log("Veri çekme hatası: " + err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};

exports.post_blog_create = async(req, resp) => {
    const baslik = req.body.baslik;
    const altbaslik = req.body.altbaslik;
    const aciklama = req.body.aciklama;
    const anasayfa = req.body.anasayfa == "on" ? true:false;
    const onay = req.body.onay == "on" ? true:false;
    const userId = req.session.userId;
    let resim = "";

    try{
        if(baslik == ""){
            throw new Error ("Başlık boş geçilemez");
        }
        if(baslik.length < 5 || baslik.length > 20){
            throw new Error ("Başlık 5 ile 20 karakter arası olmalı.");
        }
        if(aciklama == ""){
            throw new Error ("Açıklama boş geçilemez");
        }
        if(aciklama.length < 20 || aciklama.length > 100){
            throw new Error ("Açıklama 20 ile 100 karakter arası olmalı.");
        }

        if(req.file){
            resim = req.file.filename;
            fs.unlink("./public/images/" + req.body.resim, err => {
                console.log(err);
            });
        }
        // await dbconn.query("insert into blog(baslik, aciklama, resim, anasayfa, onay, category_id, altbaslik) values ($1,$2,$3,$4,$5,$6,$7)", 
        // [baslik, aciklama, resim, anasayfa, onay, kategori, altbaslik]);
        await Blog.create({
            baslik: baslik,
            url: slugField(baslik),
            altbaslik: altbaslik,
            aciklama: aciklama,
            resim: resim,
            anasayfa: anasayfa,
            onay: onay,
            userId: userId
        });
        resp.redirect("/admin/blogs?action=create");
    }
    catch(err){
        let hataMesaji = "";
        if(err instanceof Error){
            hataMesaji += err.message;
            resp.render("admin/blog-create", {
                title: "add blog",
                categories: await Category.findAll({
                    order: [
                        ['id', 'ASC']
                    ]
                }),
                message: {text:hataMesaji, class:"danger"},
                values: {
                    baslik: baslik,
                    altbaslik: altbaslik,
                    aciklama: aciklama
                }
            });

        }
        console.log("Veri çekme hatası: " + err);
        //resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};

exports.get_category_create = async(req, resp) => {
    resp.render("admin/category-create", {
        title: "add category"
    });
};

exports.post_category_create = async(req, resp) => {
    const name = req.body.name;
    
    try{
        await Category.create({ 
            name: name,
            url: slugField(name),
        });
        resp.redirect("/admin/categories?action=create");
    }
    catch(err){
        console.log("Kategori oluşturma hatası: " + err);
        resp.status(500).send("Kategori oluşturma hatası: " + err.message);
    }
};

exports.get_blog_edit = async(req, resp) => {
    const blogId = req.params.blogId;
    const userId = req.session.userId;
    const isAdmin = req.session.roles.includes("admin");

    try{
        // const {rows: blog} = await dbconn.query("select * from blog where id=$1", [blogId]);
        const blog = await Blog.findOne({
            where: isAdmin ? { id: blogId } : { id: blogId, userId: userId },
            include: {
                model: Category,
                attributes: ["id"]
            }
        });
        if (blog){
            // const {rows: categories} = await dbconn.query("select * from category order by 1");
            const categories = await Category.findAll({
                order: [
                    ['id', 'ASC']
                ]
            });
            return resp.render("admin/blog-edit", {
                title: blog.baslik,
                blog: blog,
                categories: categories 
            });
        }
        resp.redirect("/admin/blogs");
    }
    catch(err){
        console.log("Veri çekme hatası: " + err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};

exports.post_blog_edit = async(req, resp) => {
    const blogId = req.body.blogId;
    const baslik = req.body.baslik;
    const url = req.body.url;
    const altbaslik = req.body.altbaslik;
    const aciklama = req.body.aciklama;
    const categoryIds = req.body.categories;
    const userId = req.session.userId;
    let resim = req.body.resim;
    const isAdmin = req.session.roles.includes("admin");

    if(req.file){
        resim = req.file.filename;
        fs.unlink("./public/images/" + req.body.resim, err => {
            console.log(err);
        });
    }
    const anasayfa = req.body.anasayfa == "on" ? true:false;
    const onay = req.body.onay == "on" ? true:false;

    try{
        // await dbconn.query("update blog set baslik=$1, aciklama=$2, resim=$3, anasayfa=$4, onay=$5, category_id=$6, altbaslik=$7 where id=$8", 
        // [baslik, aciklama, resim, anasayfa, onay, kategori, altbaslik, blogId]);
        const blog = await Blog.findOne({
            where: isAdmin ? { id: blogId } : { id: blogId, userId: userId },
            include: {
                model: Category,
                attributes: ["id"]
            }
        });
        if(blog){
            blog.baslik = baslik;
            blog.url = url;
            blog.altbaslik = altbaslik;
            blog.aciklama = aciklama;
            blog.resim = resim;
            blog.anasayfa = anasayfa;
            blog.onay = onay;

            if(categoryIds == undefined){
                await blog.removeCategories(blog.categories);
            } else{
                await blog.removeCategories(blog.categories);
                const selectedCategories = await Category.findAll({
                    where:{
                        id: {
                            [Op.in]: categoryIds
                        }
                    }
                });
                await blog.addCategories(selectedCategories);
            }

            await blog.save();
            return resp.redirect("/admin/blogs?action=edit&blogId=" + blogId);
        }
        resp.redirect("/admin/blogs");
    }
    catch(err){
        console.log("Veri çekme hatası: " + err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};

exports.post_category_remove = async(req, resp) =>{
    const blogId = req.body.blogId;
    const categoryId = req.body.categoryId;

    await dbconn.query(`delete from "blogCategory" where "blogId" = ${blogId} and "categoryId" = ${categoryId}`);
    resp.redirect("/admin/categories/" + categoryId);
};

exports.get_category_edit = async(req, resp) => {
    const categoryId = req.params.categoryId;
    try{
        // const {rows: category} = await dbconn.query("select * from category where id=$1", [categoryId]);
        
        // const category = await Category.findAll({
        //     where: {
        //         id: categoryId
        //     }
        // });

        const category = await Category.findByPk(categoryId);

        if (category){
            const blogs = await category.getBlogs();
            return resp.render("admin/category-edit", {
                title: category.name,
                category: category,
                blogs: blogs
            });
        }
        resp.redirect("/admin/categories");
    }
    catch(err){
        console.log("Veri çekme hatası: " + err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};

exports.post_category_edit = async(req, resp) => {
    const categoryId = req.body.categoryId;
    const name = req.body.name;

    try{
        // await dbconn.query("update category set name=$1 where id=$2", [baslik, categoryId]);
        await Category.update({ name: name}, {
            where: {
                id: categoryId
            }
        });
        return resp.redirect("/admin/categories?action=edit&categoryId=" + categoryId);
    }
    catch(err){
        console.log("Veri çekme hatası: " + err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};

exports.get_blog_list = async(req, resp) => {
    const userId = req.session.userId;
    const isModerator = req.session.roles.includes("moderator");
    const isAdmin = req.session.roles.includes("admin");
    try{
        // const {rows: blogs} = await dbconn.query("select id, baslik, altbaslik, resim from blog order by 1");
        const blogs = await Blog.findAll({ 
            attributes: ["id", "baslik", "altbaslik", "resim"],
            include: {
                model: Category,
                attributes: ["name"]
            },
            where: isModerator && !isAdmin ? { userId: userId } : null,
            order: [
                ['id', 'ASC']
            ]
        });
        resp.render("admin/blog-list", {
            title: "blog list",
            blogs: blogs,
            action: req.query.action,
            blogId: req.query.blogId
        });
    }
    catch(err){
        console.log("Veri çekme hatası: " + err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};

exports.get_category_list = async(req, resp) => {
    try{
        //const {rows: categories} = await dbconn.query("select id, name from category order by 1");
        const categories = await Category.findAll({
            order: [
                ['id', 'ASC']
            ]
        });
        resp.render("admin/category-list", {
            title: "category list",
            categories: categories,
            action: req.query.action,
            categoryId: req.query.categoryId
        });
    }
    catch(err){
        console.log("Veri çekme hatası: " + err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};

exports.get_roles = async(req, resp) => {
    try{
        const roles = await Role.findAll({
            attributes: {
                include: ["role.id", "role.rolename", [dbconn.fn("COUNT", dbconn.col("users.id")), "user_count"]]
            },
            include: [
                { model: User, attributes: ["id"]}
            ],
            group: ["role.id"],
            raw: true,
            includeIgnoreAttributes: false,
            order: [
                ['id', 'ASC']
            ]
        });

        resp.render("admin/role-list", {
            title: "role list",
            roles: roles
        });
    }
    catch(err){
        console.log("Veri çekme hatası: " + err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};

exports.get_role_edit = async(req, resp) => {
    const roleId = req.params.roleId;
    try{
        const role = await Role.findByPk(roleId);
        const users = await role.getUsers();
        if(role){
            return resp.render("admin/role-edit", {
                title: role.rolename,
                role: role,
                users: users
            });
        }
        resp.redirect("admin/roles");
    }
    catch(err){
        console.log("Veri çekme hatası: " + err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};

exports.post_role_edit = async(req, resp) => {
    const roleId = req.body.roleId;
    const roleName = req.body.name;
    try{
        await Role.update({ rolename: roleName }, {
            where: { id: roleId }
        });
        return resp.redirect("/admin/roles");
    }
    catch(err){
        console.log("Veri çekme hatası: " + err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};

exports.post_role_remove = async(req, resp) => {
    const roleId = req.body.roleId;
    const userId = req.body.userId;
    try{
        await dbconn.query(`delete from "userRoles" where "userId" = ${userId} and "roleId" = ${roleId}`);
        return resp.redirect("/admin/roles/" + roleId);
    }
    catch(err){
        console.log("Veri çekme hatası: " + err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};

exports.get_users = async(req, resp) => {
    try{
        const users = await User.findAll({
            attributes: ["id", "fullname", "email"],
            include: {
                model: Role,
                attributes: ["rolename"]
            },
            order: [
                ['id', 'ASC']
            ]
        });
        resp.render("admin/user-list", {
            title: "user list",
            users: users
        });
    }
    catch(err){
        console.log("Veri çekme hatası: " + err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};

exports.get_user_edit = async(req, resp) => {
    const userId = req.params.userId;
    try{
        const user = await User.findOne({
            where: { id: userId },
            include: { model: Role, attributes: ["id"] }
        });

        const roles = await Role.findAll({
            order: [
                ['id', 'ASC']
            ]
        });

        resp.render("admin/user-edit", {
            title: "user edit",
            user: user,
            roles: roles
        });
    }
    catch(err){
        console.log("Veri çekme hatası: " + err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};

exports.post_user_edit = async(req, resp) => {
    const userId = req.body.userId;
    const fullname = req.body.fullname;
    const email = req.body.email;
    const roleIds = req.body.roles;

    try{
        const user = await User.findOne({
            where: { id: userId },
            include: { model: Role, attributes: ["id"] }
        });

        if(user){
            user.fullname = fullname;
            user.email = email;
            if(roleIds == undefined){
                await user.removeRoles(user.roles);
            } else {
                await user.removeRoles(user.roles);
                const selectedRoles = await Role.findAll({
                    where: {
                        id: {
                            [Op.in]: roleIds
                        }
                    }
                });
                await user.addRoles(selectedRoles);
            }
            await user.save();
            return resp.redirect("/admin/users");
        }
        return resp.redirect("/admin/users");
    }
    catch(err){
        console.log("Veri çekme hatası: " + err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    }
};