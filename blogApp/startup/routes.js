const express = require("express");
const userRoutes = require("../routes/user");
const adminRoutes = require("../routes/admin");
const authRoutes = require("../routes/auth");
const error = require("../middlewares/error");
const path = require("path");

module.exports = function(app){
    //static linkler
    app.use("/libs",express.static(path.join(__dirname, "../node_modules")));
    app.use("/static",express.static(path.join(__dirname, "../public")));

    app.use("/admin",adminRoutes);
    app.use("/account",authRoutes);
    app.use(userRoutes);
    // app.use(errorHandling);
    app.get("/error/500", (req, resp) => {
        resp.status(500).render("error/500", {
            title: "hata Sayfası"
        });
    });
    app.get("*", (req, resp) => {
        resp.status(404).render("error/404", {
            title: "Not Found"
        });
    });
    app.use(error);
};