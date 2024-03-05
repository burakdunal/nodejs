const dotenv = require('dotenv');
dotenv.config();
const config = require("config");
const express = require("express");
const app = express();
// const envConfig = require("./core/envConfig");
const cors = require("cors");
const prodRoutes = require("./routes/products");
const homeRoutes = require("./routes/home");
const listenPort = config.get("appArgs.listenPort");
const myCustomVar = config.get("customVars.myCustomVar1");

app.use(express.json());

// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "GET");
//     next();
// });

app.use(cors({
    origin: "*", // ["abc.com", "def.com"]
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: true
}));


app.use("/api/products", prodRoutes);
app.use(homeRoutes);
if(process.env.NODE_ENV == "production"){
    require("./startup/production")(app);
}

console.log(config.get("name"));
console.log(myCustomVar);

app.listen(listenPort, () => {
    console.log("Listening port " + listenPort);
})