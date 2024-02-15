const express = require("express");
const app = express();
const myConfig = require("./core/myConfig");

//template engine
app.set("view engine", "ejs");

//node modules
const path = require("path");

//Database & Models
require("./startup/db")();

//middlewares & app.listen
require("./startup/middlewares")(app);

// routes
require("./startup/routes")(app);

// throw new Error("uncaught exception ***");

if(myConfig.appConf.nodeEnv == "production"){
    require("./startup/production")(app);
};

console.log(myConfig.appConf.name);