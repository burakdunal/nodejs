const dotenv = require("dotenv");
dotenv.config();
const config = require("config");

const myConfig = {
    seqdb: {
        host: config.get("db.host"),
        database: config.get("db.name"),
        user: config.get("db.user"),
        pass: config.get("db.pass"),
        port: config.get("db.port"),
        allowExitOnIdle: true
    },
    appConf: {
        port: config.get("appArgs.port"),
    },
    mailerConf: {
        host: config.get("mailer.mailhost"),
        user: config.get("mailer.mailuser"),
        password: config.get("mailer.mailpass"),
        from: config.get("mailer.mailfrom"),
        port: 465
    },
    urlConf: {
        forntendEndpoint: config.get("appArgs.nodeenv") == "development" ? config.get("frontAppArgs.localEndpoint") : config.get("frontAppArgs.prodEndpoint"),
        mainDomain: config.get("appArgs.nodeenv") == "development" ? config.get("frontAppArgs.localMainDomain") : config.get("frontAppArgs.prodMainDomain")
    }
};

module.exports = myConfig;