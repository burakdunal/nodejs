const config = require("config");
const fs = require("fs");
const Product = require("../models/products");
const Category = require("../models/category");
const slugfield = require("../helper/slugfield");

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
      await removeImg(req.file.filename);

      let hataMesaji = "";
      if (err instanceof Error) {
        hataMesaji += err.message;
        res.status(500).send({ status: "error", text: hataMesaji });
      }
      console.log("Başarısız: " + hataMesaji);
    }
  } catch (error) {
    await removeImg(req.file.filename);
    
    let hataMesaji = "";
    if (error instanceof Error) {
      hataMesaji += error.message;
      res.status(500).send({ status: "error", text: hataMesaji });
    }
    console.log("Başarısız: " + hataMesaji);
  }
};

exports.post_product_edit = async (req, res) => {
  let imageExists = false;
  let prevImgDelStatus = true;
  try {
    const prodId = req.params.prodId;
    if (req.body.image !== "") {
      if (!req.file) {
        return res.status(400).send({ status: "error", text: "Ürün görseli sunucuya yüklenemedi."});
      }
      imageExists = true;
    }

    const product = await Product.findOne({
      where: {id: prodId},
      include: {
        model: Category,
        attributes: ["id"]
      }
    });

    if (product) {
      const name = req.body.name;
      const price = req.body.price;
      const descr = req.body.descr;
      const is_actv = req.body.is_actv == "true" ? true : false;
      const categoryId = req.body.categoryId;

      
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

      if (imageExists) {
        let image = "images/products/" + req.file.filename;
        const prevImage = product.image;
        const removePrevImgResult = await removeImg(prevImage, "removeProduct");
        if (!removePrevImgResult) {
          const removeImgResult = await removeImg(image, "removeProduct");
          if (!removeImgResult) {
            throw new Error("Eski ve yeni ürün görseli sunucudan kaldırılamadığı için işlem iptal edildi.");
          } else {
            prevImgDelStatus = false;
          }
        }
      }
    
      if (imageExists && prevImgDelStatus) {
        const image = "images/products/" + req.file.filename;
        product.image = image;
      } else {
        if (product.image !== "" && product.name !== name) {
          const fileExt = product.image.split('.').pop();
          const oldImgName = './public/' + product.image;
          const newImgName = 'images/products/' + slugfield(name) + "-"+ Date.now() + "." + fileExt;
          fs.rename(oldImgName, './public/' + newImgName, (err) => {
            if (err) throw new Error("Ürün görsel ismi değiştirilemedi.");
            product.image = newImgName;
          });
        }
      }
      
      product.name = name;
      product.descr = descr;
      product.price = price;
      product.is_actv = is_actv;

      await product.setCategories(categoryId);
      await product.save();
      let responseMsg;
      if (prevImgDelStatus) {
        responseMsg = { status: "success", text: "Ürün güncelleme başarılı."};
      } else {
        responseMsg = { status: "warning", text: "Eski ürün görseli kaldırılamadı ancak ürün bilgileri güncellendi." };
      }
      res.status(200).send(responseMsg);
    }
  } catch (error) {
    if (imageExists && prevImgDelStatus) {
      await removeImg(req.file.filename);
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
    const product = await Product.findOne({
      where: {
        id: 1,
      },
      raw: true,
    });
    if (product) {
      return res.send({ status: "success", title: product.name, product });
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
    await removeImg(req.file.filename);

    let hataMesaji = "";
    if (err instanceof Error) {
      hataMesaji += err.message;
      res.status(500).send({ status: "error", text: hataMesaji });
    }
    console.log("Başarısız: " + hataMesaji);
  }
};

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

const removeImg = async (filename, oper) => {
  let path;
  if (oper === "removeProduct") {
    path = "./public/" + filename;
  } else {
    path = "./public/images/products/" + filename;
  }

  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};
