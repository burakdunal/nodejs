const config = require("config");
const fs = require("fs");
const path = require("path");
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
      await removeImg(req.file.filename, "addProduct");
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

const removeImg = async (filename, oper) => {
  if (oper === "removeProduct" || oper === "removeCategory") {
    filePath = path.join(__dirname,'../public/') + filename;
  } else if (oper === "addProduct") {
    filePath = path.join(__dirname,'../public/images/products/')  + filename;
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
