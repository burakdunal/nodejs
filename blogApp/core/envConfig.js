const dotenv = require('dotenv');
dotenv.config();

const envConfig = {
    port: process.env.PORT,
    dbhost: process.env.DBHOST,
    dbuser: process.env.DBUSER,
    dbpass: process.env.DBPASS,
    dbname: process.env.DBNAME,
    dbport: process.env.DBPORT,
    mailuser: process.env.MAILUSER,
    mailpass: process.env.MAILPASS,
    mailfrom: process.env.MAILFROM,
    mailhost: process.env.MAILHOST,
    sessisecret: process.env.SESSISECRET,
  };

  module.exports = envConfig;