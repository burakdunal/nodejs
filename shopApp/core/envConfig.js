const dotenv = require('dotenv');
dotenv.config();

const envConfig = {
    port: process.env.PORT
  };

  module.exports = envConfig;