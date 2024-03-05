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
    }
};

module.exports = myConfig;