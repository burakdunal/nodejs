//const { Client } = require('pg');
const myConfig = require("../core/myConfig");
const Sequelize = require("sequelize");

const dbconn = new Sequelize(myConfig.seqdb.database, myConfig.seqdb.user, myConfig.seqdb.password, {
  dialect: "postgres",
  host: myConfig.seqdb.host,
  define: {
    timestamps: false
  },
  storage: "./session.postgres"
});

dbconn
.authenticate()
.then(() => console.log("seqDb bağlantısı yapıldı."));
    

// const connect = async()=>{
//   try{
//     await 
//   }
//   catch(err){
//     console.log("Bağlantı hatası: ", err);
//   }
// }

// connect();
module.exports = dbconn;

// const dbconn = new Client(config.db);

// dbconn.connect()
//   .then(() => {
//     console.log("Veritabanı bağlantısı başarılı!");
//   })
//   .catch(err => {
//     console.error("Veritabanı bağlantı hatası:", err);
//   });

// module.exports = dbconn;