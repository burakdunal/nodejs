module.exports = function(){
  const myConfig = require("../core/myConfig");
  const dbconn = require("../data/database");
  const dummyData = require("../data/dummy-data.js");

  const Product = require("../models/products");
  const Category = require("../models/category");
  
  Product.belongsToMany(Category, { through: "productCategory" });
  Category.belongsToMany(Product, { through: "productCategory" });

  (async () => {
      await dbconn.sync(); //{ force: true}
      // await dummyData();
  })();
};