require("express-async-errors");
const config = require("../core/myConfig");
const Blog = require("../models/blog");
const Category = require("../models/category");
const { Op } = require("sequelize");


// exports.blogs_by_category = async(req, resp) =>{
//     const categorySlug = req.params.slug;
//     try{
//         // const { rows: blogs } = await dbconn.query("SELECT * FROM blog where blog.category_id=$1",[categoryId]);
//         // const { rows: categories} = await dbconn.query("select * from category order by 1");
//         const blogs = await Blog.findAll({
//             where: {
//                 onay: true
//             },
//             include: {
//                 model: Category,
//                 where: { url: categorySlug}
//             },
//             order: [
//                 ['id', 'ASC']
//             ],
//             raw: true
//         });
//         const categories = await Category.findAll({
//             order: [
//                 ['id', 'ASC']
//             ]
//         });

//         resp.render("users/blogs", {
//             title:"Bloglar",
//             blogs: blogs,
//             categories: categories,
//             selectedCategory: categorySlug
//         });
//     }
//     catch(err){ // Doğru şekilde `.catch` kullanımı
//         console.error("Veri çekme hatası:", err);
//         resp.status(500).send("Veri çekme hatası: " + err.message);
//     };
// };

exports.blog_details = async(req, resp) => {
    const blogSlug = req.params.slug;
    try{
        // const { rows: blog } = await dbconn.query("SELECT * FROM blog where id=$1",[blogId]);
        const blog = await Blog.findOne({
            where: {
                url: blogSlug
            },
            raw: true
        });
        if (blog){
            return resp.render("users/blog-details", {
                title: blog.baslik,
                blog: blog
            });
        }
        resp.redirect("/404");
    }
    catch(err){ // Doğru şekilde `.catch` kullanımı
        console.error("Veri çekme hatası:", err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    };
};

exports.blog_list = async(req, resp) => {
    let page = 0;
    if(req.params.pageNumber){
        page = req.params.pageNumber - 1;
    }
    
    const shownBlogs = config.pgnParams.shown;
    //const { page = 0 } = req.query;
    const categorySlug = req.params.slug;
    try{
        // const { rows: blogs } = await dbconn.query("SELECT * FROM blog where onay=true order by 1");
        // const { rows: categories} = await dbconn.query("select * from category order by 1");
        
        const { rows, count} = await Blog.findAndCountAll({
            where: { onay: {[Op.eq]: true } },
            raw: true,
            include: categorySlug ? { model: Category, where: { url: categorySlug }} : null,
            limit: shownBlogs,
            offset: page * shownBlogs,
            order: [
                ['id', 'ASC']
            ]
        });

        const categories = await Category.findAll({
            order: [
                ['id', 'ASC']
            ]
        });
        resp.render("users/blogs", {
            title:"Bloglar",
            blogs: rows,
            totalItems: count,
            totalPages: Math.ceil(count / shownBlogs),
            currentPage: page,
            categories: categories,
            selectedCategory: categorySlug
        });
    }
    catch(err){ // Doğru şekilde `.catch` kullanımı
        console.error("Veri çekme hatası:", err);
        resp.status(500).send("Veri çekme hatası: " + err.message);
    };
};

exports.index = async(req, resp) => {
    // const { rows: blogs } = await dbconn.query("SELECT * FROM blog where onay=true and anasayfa=true order by 1")
    // const { rows: categories} = await dbconn.query("select * from category order by 1");
    // throw new Error("server error");

    const blogs = await Blog.findAll({
        where: {
            anasayfa: true,
            onay: true
        },
        order: [
            ['id', 'ASC']
        ],
        raw: true
    });

    const categories = await Category.findAll({ 
        order: [
            ['id', 'ASC']
        ],
        raw: true 
    });
    resp.render("users/index", {
        title:"Popüler Kurslar",
        blogs: blogs,
        categories: categories,
        selectedCategory: null
    });
};