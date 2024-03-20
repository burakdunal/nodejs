const Sequelize = require("sequelize");
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

exports.get_categories = async (req, res) => {
  try {
    // const categories = await Category.findAll({
    //   // raw: true,
    // });
    const categories = await Category.findAll({
      include: {
        model: Product,
        attributes: [], // Sadece ürün sayısını almak için diğer öznitelikleri sıralamayın
      },
      attributes: ['id', 'name', 'createdAt', [Sequelize.fn('COUNT', Sequelize.col('products.id')), 'productCount']], // Ürün sayısını almak için COUNT fonksiyonunu kullanın
      group: ['category.id'], // Kategoriye göre gruplayın
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