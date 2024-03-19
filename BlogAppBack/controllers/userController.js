const products = [
    {id: 1, name: "iphone 12", price: 20000},
    {id: 2, name: "iphone 13", price: 30000},
    {id: 3, name: "iphone 14", price: 40000}
];

const Blog = require("../models/blog");

exports.get_blog_details = async(req, res) => {
    const blogId = req.params.blogId;
    try{
        // const { rows: blog } = await dbconn.query("SELECT * FROM blog where id=$1",[blogId]);
        const blog = await Blog.findOne({
            where: {
                id: blogId
            },
            raw: true
        });
        if (blog){
            res.locals.customVar = "burak";
            return res.send({title: blog.baslik, blog, customVar: res.locals.customVar});
        }
        res.status(404).send("Blog bulunamadı.");
    }
    catch(err){ // Doğru şekilde `.catch` kullanımı
        console.error("Veri çekme hatası:", err);
        res.status(500).send("Veri çekme hatası: " + err.message);
    };
};

exports.get_index = async(req, res) => {
    // console.log(products[0].name);
    // res.send(products);
    const blogs = await Blog.findAll({
        where: {
            anasayfa: true,
            onay: true
        },
        order: [
            ["id", "ASC"]
        ],
        raw: true
    });

    res.send({title: "Anasayfa", blogs});
};