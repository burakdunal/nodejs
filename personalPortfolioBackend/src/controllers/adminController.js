const config = require("config");
const fs = require("fs");
const path = require("path");
// const Product = require("../models/products");
// const Category = require("../models/category");
const slugfield = require("../helper/slugfield");
const bcrypt = require("bcrypt");
const {Admin, Blog, BlogCategories, Resume, ResumeCategories, User } = require("../data/models/models");

exports.get_admin = (req, res) => {
  const title = "admin";
  const data = "admin sayfasına hoş geldin";
  const adminId = 1;
  const token = jwt.sign(
    { _id: adminId, auth: "admin" },
    config.get("tokensecret")
  );
  res.header("x-auth-token", token).send({ title, data });
};

exports.get_user = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: 1,
      },
    });

    const resumes = await Resume.findAll({
      attributes: ['title', 'date', 'descr'],
      include: {
        model: ResumeCategories,
        attributes: ["id","icon"],
        through: {
          attributes: [] // Ara tablodan hiçbir alanı döndürmez
        }
      },
      order: [[ResumeCategories, 'id', 'ASC']],
    });

    const latestBlogs = await Blog.findAll({
      attributes: ['id', 'url', 'title', 'img', 'excerpt', 'createdAt'],
      include: {
        model: BlogCategories,
        attributes: ["id", "name"],
        through: {
          attributes: []
        }
      },
      order: [['id', 'DESC']],
      limit: 3
    });

    if (user && resumes && latestBlogs) {
      const educationData = resumes.filter(item => item.resumeCategories.some(cat => cat.id === 1));
      const experienceData = resumes.filter(item => item.resumeCategories.some(cat => cat.id === 2));
      return res.send({ status: "success", user, educationData, experienceData, latestBlogs });
    }
    res.status(404).send("Kişi ve/veya özgeçmiş bilgileri bulunamadı.");
  } catch (err) {
    console.error("Veri çekme hatası:", err);
    res.status(500).send("Veri çekme hatası: " + err.message);
  }
};

exports.get_userDetail = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: 1,
      },
    });

    if (user) {
      return res.send({ status: "success", user});
    }
    res.status(404).send("Kişi bilgileri bulunamadı.");
  } catch (err) {
    console.error("Veri çekme hatası:", err);
    res.status(500).send("Veri çekme hatası: " + err.message);
  }
};

exports.get_product_detail = async (req, res) => {
  const prodId = req.params.prodId;
  try {
    const product = await Product.findOne({
      where: {
        id: prodId,
      },
      include: Category,
      through: "productCategory",
      // raw: true,
    });

    if (product) {
      return res.send({ status: "success", product });
    }
    res.status(404).send("Ürün bulunamadı.");
  } catch (err) {
    // Doğru şekilde `.catch` kullanımı
    console.error("Veri çekme hatası:", err);
    res.status(500).send("Veri çekme hatası: " + err.message);
  }
};

exports.post_product_create = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Dosya yüklenemedi.");
    }
    
    const name = req.body.name;
    const price = req.body.price;
    const descr = req.body.descr;
    const is_actv = req.body.is_actv == "true" ? true : false;
    const categoryId = req.body.categoryId;
    let image = req.file.filename;

    try {
      if (name == "") {
        throw new Error("Başlık boş geçilemez");
      }
      if (name.length < 5 || name.length > 25) {
        throw new Error("Başlık 5 ile 25 karakter arası olmalı.");
      }
      if (descr !== "") {
        if (descr.length < 20 || descr.length > 200) {
          throw new Error("Açıklama 20 ile 200 karakter arası olmalı.");
        }
      }

      image = "images/products/" + image;
      const addedProduct = await Product.create({
        name,
        price,
        descr,
        image,
        is_actv,
      });

      const category = await Category.findByPk(categoryId);

      if (category) {
        await category.addProduct(addedProduct);
      }

      res.send({ status: "success", text: "Ürün ekleme başarılı." });
    } catch (err) {
      await removeImg(req.file.filename, "addProduct");

      let hataMesaji = "";
      if (err instanceof Error) {
        hataMesaji += err.message;
        res.status(500).send({ status: "error", text: hataMesaji });
      }
      console.log("Başarısız: " + hataMesaji);
    }
  } catch (error) {
    await removeImg(req.file.filename, "addProduct");
    
    let hataMesaji = "";
    if (error instanceof Error) {
      hataMesaji += error.message;
      res.status(500).send({ status: "error", text: hataMesaji });
    }
    console.log("Başarısız: " + hataMesaji);
  }
};

exports.post_person_edit = async (req, res) => {
  let imageExists = false;
  let prevImgDelStatus = true;
  try {
    if (req.body.image !== "") {
      if (!req.file) {
        return res.status(400).send({ status: "error", text: "Kişi fotoğrafı sunucuya yüklenemedi."});
      }
      imageExists = true;
    }

    const user = await User.findOne({
      where: {id: 1}
    });

    if (user) {
      const fullname = req.body.name;
      const title = req.body.title;
      const email = req.body.email;
      const location = req.body.location;
      const about = req.body.about;
      
      if (fullname == "") {
        throw new Error("İsim Soyisim boş geçilemez");
      }
      if (fullname.length < 5) {
        throw new Error("İsim Soyisim 5 karakterden kısa olamaz.");
      }
      if (about !== "") {
        if (about.length < 20 || about.length > 800) {
          throw new Error("Açıklama 20 ile 800 karakter arası olmalıdır.");
        }
      }

      if (imageExists) {
        let image = "images/user/" + req.file.filename;
        const prevImage = user.img;
        const removePrevImgResult = await removeImg(prevImage, "removeUser");
        if (!removePrevImgResult) {
          const removeImgResult = await removeImg(image, "removeUser");
          if (!removeImgResult) {
            throw new Error("Eski ve yeni fotoğraf sunucudan kaldırılamadığı için işlem iptal edildi.");
          } else {
            prevImgDelStatus = false;
          }
        }
      }
    
      if (imageExists && prevImgDelStatus) {
        const image = "images/user/" + req.file.filename;
        user.img = image;
      } else {
        if (user.img !== "" && user.fullname !== fullname) {
          const fileExt = user.img.split('.').pop();
          const oldImgName = './public/' + user.img;
          const newImgName = 'images/user/' + slugfield(fullname) + "-"+ Date.now() + "." + fileExt;
          fs.rename(oldImgName, './public/' + newImgName, (err) => {
            if (err) throw new Error("Kişi fotoğraf ismi değiştirilemedi.");
            user.img = newImgName;
          });
        }
      }
      
      user.fullname = fullname;
      user.title = title;
      user.email = email;
      user.location = location;
      user.about = about;

      await user.save();
      let responseMsg;
      if (prevImgDelStatus) {
        responseMsg = { status: "success", text: "Kişi bilgileri güncelleme başarılı."};
      } else {
        responseMsg = { status: "warning", text: "Eski kişi görseli kaldırılamadı ancak kişi bilgileri güncellendi." };
      }
      res.status(200).send(responseMsg);
    }
  } catch (error) {
    if (imageExists && prevImgDelStatus) {
      await removeImg(req.file.filename, "addUser");
    }
    let hataMesaji = "";
    if (error instanceof Error) {
      hataMesaji += error.message;
      res.status(500).send({ status: "error", text: hataMesaji });
    }
    console.log("Başarısız: " + hataMesaji);
  }
};

exports.post_product_test = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: 1,
      },
      //raw: true,
    });
    if (category) {
      return res.send({ status: "success", title: category.name, category });
    }
    res.status(404).send({
      status: "error",
      text: "Ürün bulunamadı.",
      class: "danger",
    });
  } catch (err) {
    // Doğru şekilde `.catch` kullanımı
    console.error("Veri çekme hatası:", err);
    res.status(500).send({
      status: "error",
      text: err.message,
      class: "danger",
    });
  }
}

exports.post_product_delete = async (req, res) => {
  try {
    const prodId = req.params.prodId;
    const product = await Product.findByPk(prodId);

    if (!product) {
      res.status(404).send({ status: "error", text: 'Ürün bulunamadı' });
    }

    const prodImg = product.image;

    if (prodImg !== "") {
      const removeImgResult = await removeImg(prodImg, "removeProduct");
      if (!removeImgResult) {
        throw new Error("Ürün görseli sunucudan kaldırılamadığı için ürün silinemedi.");
      }
    }

    await product.destroy();
    return res.status(200).send({ status: "success", text: 'Ürün başarıyla silindi' });

  } catch (error) {
    if (error instanceof Error) {
      let hataMesaji = error.message;
      res.status(500).send({ status: "error", text: hataMesaji });
    } else {
      console.log("else'e girdi.");
      res.status(500).send({ status: "error", text: error });
    }
  }
}

exports.get_categories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      raw: true,
    });
    if (categories) {
      return res.send({ status: "success", categories });
    }
    res.status(404).send("Kategoriler bulunamadı.");
  } catch (err) {
    console.error("Veri çekme hatası:", err);
    res.status(500).send("Veri çekme hatası: " + err.message);
  }
};

exports.get_category_detail = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await Category.findOne({
      where: {
        id: categoryId,
      },
      include: Product,
      through: "productCategory",
      //raw: true,
    });

    if (category) {
      return res.send({ status: "success", category });
    }
    res.status(404).send("Kategori bulunamadı.");
  } catch (err) {
    // Doğru şekilde `.catch` kullanımı
    console.error("Veri çekme hatası:", err);
    res.status(500).send("Veri çekme hatası: " + err.message);
  }
};

exports.post_category_create = async (req, res) => {
  const name = req.body.name;
  const descr = req.body.descr;
  let image = req.file.filename;

  try {
    if (name == "") {
      throw new Error("Kategori ismi boş geçilemez");
    }
    if (name.length < 3 || name.length > 50) {
      throw new Error("Kategori ismi 3 ile 50 karakter arası olmalı.");
    }
    if (descr !== "") {
      if (descr.length < 20 || descr.length > 200) {
        throw new Error("Açıklama 20 ile 200 karakter arası olmalı.");
      }
    }

    const urlName = slugfield(name);
    image = "images/categories/" + image;
    await Category.create({
      name,
      descr,
      url: urlName,
      image,
    });

    res.send({ status: "success", text: "Kategori ekleme başarılı." });
  } catch (err) {
    await removeImg(req.file.filename, "addCategory");

    let hataMesaji = "";
    if (err instanceof Error) {
      hataMesaji += err.message;
      res.status(500).send({ status: "error", text: hataMesaji });
    }
    console.log("Başarısız: " + hataMesaji);
  }
};

exports.get_category_delete = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await Category.findOne({
      where: {
        id: categoryId,
      },
      include: Product,
      through: "productCategory",
      //raw: true,
    });

    if (!category) {
      return res.status(404).send({ status: "error", text: 'Kategori bulunamadı' });
    };

    if (category.products.length > 0) {
      return res.status(200).send({ status: "warning" });
    } else {
      return res.status(200).send({ status: "proceed" });
    };
  } catch (err) {
    // Doğru şekilde `.catch` kullanımı
    console.error("Veri çekme hatası:", err);
    res.status(500).send({
      status: "error",
      text: err.message,
      class: "danger",
    });
  }
}

exports.post_category_delete = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const childs = req.body.childs; //true or false
    const category = await Category.findOne({
      where: {
        id: categoryId,
      },
      include: Product,
      through: "productCategory",
      //raw: true,
    });

    if (!category) {
      return res.status(404).send({ status: "error", text: 'Kategori bulunamadı' });
    }
    
    const categoryImg = category.image;
    if (categoryImg !== "") {
      const removeImgResult = await removeImg(categoryImg, "removeCategory");
      if (!removeImgResult) {
        throw new Error("Kategori görseli sunucudan kaldırılamadığı için kategori silinemedi.");
      }
    }

    const products = await category.getProducts();
    if (childs) {
      if (products.length > 0) {
        await products.map(async (product) => {
          if (product.image !== "" && product.image !== null) {
            const removeImgResult = await removeImg(product.image, "removeProduct");
            if (!removeImgResult) {
              throw new Error("Ürün görseli sunucudan kaldırılamadığı için kategori silinemedi.");
            }
          }
        });

        const productIds = products.map(product => product.id);
        await Product.destroy({
          where: {
            id: productIds
          }
        });
        
        // await category.removeProducts(products);
        await category.destroy();
        return res.status(200).send({ status: "success", text: 'Kategori ve altındaki ürünler silinmiştir.' });
      } else {
        throw new Error("Kategoriye ait ürün bilgileri veritabanında bulunamadı İşlem başarısız.");
      }
    } else {
      await category.destroy();
      let resText;
      if (products.length > 0) {
        resText = 'Yalnızca kategori silinmiş, altındaki ürünler bırakılmıştır.';
      } else {
        resText = 'Kategori silinmiştir.';
      }
      return res.status(200).send({ status: "success", text: resText });
    }
    // const prodImg = product.image;

    // if (prodImg !== "") {
    //   const removeImgResult = await removeImg(prodImg, "removeProduct");
    //   if (!removeImgResult) {
    //     throw new Error("Ürün görseli sunucudan kaldırılamadığı için ürün silinemedi.");
    //   }
    // }

    // await product.destroy();
    // return res.status(200).send({ status: "success", text: 'Ürün başarıyla silindi' });

  } catch (error) {
    if (error instanceof Error) {
      let hataMesaji = error.message;
      res.status(500).send({ status: "error", text: hataMesaji });
    } else {
      console.log("else'e girdi.");
      res.status(500).send({ status: "error", text: error });
    }
  }
}

// const removeImg = async (filename, oper) => {
//   let path;
//   if (oper === "removeProduct") {
//     path = "./public/" + filename;
//   } else {
//     path = "./public/images/products/" + filename;
//   }

//   fs.unlink(path, (err) => {
//     console.log(err);
//     return false;
//   });
//   return true;
// };

exports.post_login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({
      where: {
        email: email,
      },
    });

    if (!admin) {
      return res.status(401).send({
        status: "error",
        text: "Kullanıcı bulunamadı.",
        class: "danger",
      });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).send({
        status: "error",
        text: "E-posta veya parola hatalı.",
        class: "danger",
      });
    }

    // const authToken = jwt.sign(
    //   { _id: user.id, auth: "admin" },
    //   config.get("tokensecret"),
    //   { expiresIn: "10m" }
    // );
    // const expireDate = new Date(Date.now() + 10 * 60 * 1000);
    // res
    //   .cookie("__session", authToken, {
    //     origin: "https://example-cms.inadayapp.com",
    //     domain: "inadayapp.com",
    //     expires: expireDate,
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "strict",
    //   })
    //   .cookie("checkToken", true, {
    //     origin: "https://example-cms.inadayapp.com",
    //     domain: "inadayapp.com",
    //     expires: expireDate,
    //     secure: true,
    //     sameSite: "strict",
    //   })
    //   .cookie("user", user.fullname, {
    //     origin: "https://example-cms.inadayapp.com",
    //     domain: "inadayapp.com",
    //     expires: expireDate,
    //     secure: true,
    //     sameSite: "strict",
    //   })
    //   .send({ status: "success", name: user.fullname });
    res.send({isAuth: true, name: admin.firstName});
  } catch (error) {
    if (error instanceof Error) {
      let hataMesaji = error.message;
      res.status(500).send({ status: "error", text: hataMesaji });
    } else {
      console.log("else'e girdi.");
      res.status(500).send({ status: "error", text: error });
    }
  }
};

const removeImg = async (filename, oper) => {
  if (oper === "removeUser" || oper === "removeCategory") {
    filePath = path.join(__dirname,'../public/') + filename;
  } else if (oper === "addUser") {
    filePath = path.join(__dirname,'../public/images/user/')  + filename;
  } else if (oper === "addCategory") {
    filePath = path.join(__dirname,'../public/images/categories/')  + filename;
  }

  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};
