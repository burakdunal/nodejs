const Sequelize = require("sequelize");
const myConfig = require("../core/myConfig");

const dbConn = new Sequelize(
  myConfig.seqdb.database,
  myConfig.seqdb.user,
  myConfig.seqdb.pass,
  {
    dialect: "mysql",
    host: myConfig.seqdb.host,
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  }
);

dbConn.authenticate().then(() => console.log("seqDb bağlantısı yapıldı."));
// async function dbAuth() {
//   try {
//     await dbConn.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };

module.exports = dbConn;
