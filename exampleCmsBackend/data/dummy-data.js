const Product = require("../models/products");
const User = require("../models/user");
const Category = require("../models/category");
const bcrypt = require("bcrypt");
const slugField = require("../helper/slugfield");

const dummyData = async () => {
  const users = await User.bulkCreate([
    {
      fullname: "Burak Admin",
      email: "burak@burak.com",
      password: await bcrypt.hash("193745045", 10),
    },
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
    {
      name: "Hp Victus 16-s0028nt 7.Nesil Ryzen 5 7640HS-RTX3050 6Gb-16Gb-512 Gb-16.1inc-W11",
      price: 29849.99,
      descr: "Ürün açıklama yazısı 6",
      image: "images/products/1.jpg",
      is_actv: 1,
    },
  ]);

  const categories = await Category.bulkCreate([
    {
      name: "IOS Telefonlar",
      descr: "Kategori açıklama yazısı 1",
      url: slugField("IOS Telefonlar"),
      image: "images/categories/1.jpg",
    },
    {
      name: "Android Telefonlar",
      descr: "Kategori açıklama yazısı 2",
      url: slugField("Android Telefonlar"),
      image: "images/categories/1.jpg",
    },
    {
      name: "Mac Bilgisayarlar",
      descr: "Kategori açıklama yazısı 3",
      url: slugField("Mac Bilgisayarlar"),
      image: "images/categories/1.jpg",
    },
    {
      name: "Windows Bilgisayarlar",
      descr: "Kategori açıklama yazısı 4",
      url: slugField("Windows Bilgisayarlar"),
      image: "images/categories/1.jpg",
    },
  ]);

  await categories[0].addProduct(products[0]);
  await categories[0].addProduct(products[1]);
  await categories[0].addProduct(products[2]);
  await categories[1].addProduct(products[3]);
  await categories[1].addProduct(products[4]);
  await categories[2].addProduct(products[5]);
  await categories[3].addProduct(products[6]);
};

module.exports = dummyData;
