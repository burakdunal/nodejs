const Product = require("../models/products");
const User = require("../models/user");
const Category = require("../models/category");
const bcrypt = require("bcrypt");
const slugField = require("../helper/slugfield");

const dummyData = async () => {
  const users = await User.bulkCreate([
      {fullname: "Burak Admin", email: "burak@burak.com", password: await bcrypt.hash("193745045", 10)}
  ]);

  const products = await Product.bulkCreate([
    {
      name: "iphone 12",
      price: 20000.9,
      descr: "Ürün açıklama yazısı 1",
      image: "images/products/1.jpg",
      is_actv: 1,
    },
    {
      name: "iphone 13",
      price: 29099.99,
      descr: "Ürün açıklama yazısı 2",
      image: "images/products/1.jpg",
      is_actv: 1,
    },
    {
      name: "iphone 14",
      price: 38759.0,
      descr: "Ürün açıklama yazısı 3",
      image: "images/products/1.jpg",
      is_actv: 1,
    },
    {
      name: "Samsung Galaxy S6",
      price: 15000,
      descr: "Ürün açıklama yazısı 4",
      image: "images/products/1.jpg",
      is_actv: 0,
    },
    {
      name: "Samsung Galaxy S7",
      price: 17299.99,
      descr: "Ürün açıklama yazısı 5",
      image: "images/products/1.jpg",
      is_actv: 1,
    },
    {
      name: "Macbook Air 2022 M2 13.6 inç 256SSD 8GB",
      price: 39027.48,
      descr: "Ürün açıklama yazısı 5",
      image: "images/products/1.jpg",
      is_actv: 1,
    },
  ]);

  const categories = await Category.bulkCreate([
    { name: "IOS", url: slugField("Ürün Kategorisi A") },
    { name: "Android", url: slugField("Ürün Kategorisi B") },
    { name: "Bilgisayar", url: slugField("Ürün Kategorisi C") },
    { name: "Ürün Kategorisi D", url: slugField("Ürün Kategorisi D") }
  ]);

  await categories[0].addProduct(products[0]);
  await categories[0].addProduct(products[1]);
  await categories[0].addProduct(products[2]);
  await categories[1].addProduct(products[3]);
  await categories[1].addProduct(products[4]);
  await categories[2].addProduct(products[5]);
};

module.exports = dummyData;
