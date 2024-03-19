const express = require("express");
const csurf = require("csurf");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const myConfig = require("../core/myConfig");
const dbconn = require("../data/database");
const locals = require("../middlewares/locals");
const { winstonLogger, winstonLogger2} = require("../middlewares/logger");

module.exports = function(app){
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(session({
        secret: myConfig.appConf.sessisecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: (myConfig.sessionTimeOut * 1000) * 60
        },
        store: new SequelizeStore({
            db: dbconn
        })
    }));
    app.use(csurf());
    app.use(locals);
    app.listen(myConfig.appConf.listenPort, async() => {
        winstonLogger.info("Listening port on " + myConfig.appConf.listenPort);
    });
};