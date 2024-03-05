const Category = require("../models/category");
const Product = require("../models/products");

exports.get_product_detail = async (req, res) => {
  const prodId = req.params.prodId;
  try {
    const product = await Product.findOne({
      where: {
        id: prodId,
      },
      raw: true,
    });
    if (product) {
      return res.send({ title: product.name, product });
    }
    res.status(404).send("Ürün bulunamadı.");
  } catch (err) {
    // Doğru şekilde `.catch` kullanımı
    console.error("Veri çekme hatası:", err);
    res.status(500).send("Veri çekme hatası: " + err.message);
  }
};

exports.get_products = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: Category,
      through: "productCategory",
      // raw: true,
    });
    if (products) {
      return res.send({ title: "Ürünler", products });
    }
    res.status(404).send("Ürünler bulunamadı.");
  } catch (err) {
    console.error("Veri çekme hatası:", err);
    res.status(500).send("Veri çekme hatası: " + err.message);
  }
};
