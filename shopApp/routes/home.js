const express = require("express");
const homeRoutes = express.Router();

const products = [
    {id: 1, name: "iphone 12", price: 20000},
    {id: 2, name: "iphone 13", price: 30000},
    {id: 3, name: "iphone 14", price: 40000}
];

homeRoutes.get("/", (req, res) => {
    console.log("Home çağırıldı");
    res.send(products[0]);
});

module.exports = homeRoutes;