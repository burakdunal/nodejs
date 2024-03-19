const Sequelize = require("sequelize");
const myConfig = require("../core/myConfig");

const dbConn = new Sequelize(myConfig.seqdb.database, myConfig.seqdb.user, myConfig.seqdb.pass, {
    dialect: "postgres",
    host: myConfig.seqdb.host,
    define: {
        timestamps: false
    },
    storage: "./session.postgres"
});

dbConn.authenticate().then(() => console.log("seqDb bağlantısı yapıldı."));

module.exports = dbConn;