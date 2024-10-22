import { Sequelize } from "sequelize";
import myConfig from "../core/myConfig";

const dbConn = new Sequelize(
  myConfig.seqdb.database,
  myConfig.seqdb.user,
  myConfig.seqdb.pass,
  {
    dialect: "mysql",
    host: myConfig.seqdb.host,
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
  }
);

dbConn.authenticate().then(() => console.log("seqDb bağlantısı yapıldı."));

export default dbConn;