const Sequelize = require("sequelize");
const nodemailer = require("nodemailer");
const {Blog, BlogCategories} = require("../data/models/models");
const Contact = require("../data/models/contact");
const myConfig = require("../core/myConfig");


exports.get_blog_detail = async (req, res) => {
  const blogUrl = req.params.url;
  try {
    const blog = await Blog.findOne({
      include: {
        model: BlogCategories,
        attributes: ["name"],
        through: {
          attributes: [],
        }
      },
      where: {
        url: blogUrl,
      },
      // raw: true,
    });
    if (blog) {
      return res.send({ title: blog.title, blog });
    }
    res.status(404).send("Blog bulunamadı.");
  } catch (err) {
    // Doğru şekilde `.catch` kullanımı
    console.error("Veri çekme hatası:", err);
    res.status(500).send("Veri çekme hatası: " + err.message);
  }
};

exports.get_blogs_all = async (req, res) => {
try {
  const postsCategory = await BlogCategories.findAll({
    include: [
      {
        model: Blog,
        attributes: ['id', 'url', 'title', 'img', 'excerpt', 'createdAt'],
        order: [['id', 'DESC']],
      },
    ],
    attributes: ['id', 'name']
  });

  if (postsCategory) {
    const result = postsCategory.map(category => ({
      name: category.name,
      id: category.id.toString(),
      blogs: category.blogs.map(blog => ({
        id: blog.id,
        url: blog.url,
        title: blog.title,
        img: blog.img,
        excerpt: blog.excerpt,
        createdAt: blog.createdAt
      })),
    }));
    return res.send({ result });
  }
} catch (error) {
  console.error("Veri çekme hatası:", error);
  res.status(500).send("Veri çekme hatası: " + error.message);
}
}

exports.get_blogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      attributes: ["id", "url"],
      order: [["id", "DESC"]]
    });

    if (blogs) {
      return res.send(blogs);
    }
    res.status(404).send("Bloglar bulunamadı.");
  } catch (err) {
    console.error("Veri çekme hatası:", err);
    res.status(500).send("Veri çekme hatası: " + err.message);
  }
}

// exports.get_products = async (req, res) => {
//   try {
//     const products = await Product.findAll({
//       include: Category,
//       through: "productCategory",
//       // raw: true,
//     });
//     if (products) {
//       return res.send({ title: "Ürünler", products });
//     }
//     res.status(404).send("Ürünler bulunamadı.");
//   } catch (err) {
//     console.error("Veri çekme hatası:", err);
//     res.status(500).send("Veri çekme hatası: " + err.message);
//   }
// };

// exports.get_categories = async (req, res) => {
//   try {
//     // const categories = await Category.findAll({
//     //   // raw: true,
//     // });
//     const categories = await Category.findAll({
//       include: {
//         model: Product,
//         attributes: [], // Sadece ürün sayısını almak için diğer öznitelikleri sıralamayın
//       },
//       attributes: ['id', 'name', 'createdAt', [Sequelize.fn('COUNT', Sequelize.col('products.id')), 'productCount']], // Ürün sayısını almak için COUNT fonksiyonunu kullanın
//       group: ['category.id'], // Kategoriye göre gruplayın
//     });
//     if (categories) {
//       return res.send({ status: "success", categories });
//     }
//     res.status(404).send("Kategoriler bulunamadı.");
//   } catch (err) {
//     console.error("Veri çekme hatası:", err);
//     res.status(500).send("Veri çekme hatası: " + err.message);
//   }
// };

exports.post_contact_form = async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: myConfig.mailerConf.host,
    port: myConfig.mailerConf.port,
    secure: true, // use TLS
    auth: {
      user: myConfig.mailerConf.user,
      pass: myConfig.mailerConf.password
    },
  });

  const mailOptions = {
    from: myConfig.mailerConf.from,
    to: "info@aslidunal.com",
    subject: "Yeni İletişim Formu",
    text: `İsim: ${firstName} ${lastName}\nE-Posta: ${email}\nMesaj: ${message}`
  };

  try {
    await Contact.create({
      firstName,
      lastName,
      email,
      message,
    });
    
    await transporter.sendMail(mailOptions);
    res.status(200).send({ status: "success", message: "İletişim formu kaydedilmiştir." });
  } catch (error) {
    res.status(500).send({ status: "failure", message: `Error submitting form and sending email. Err: ${error}` });
  }
}