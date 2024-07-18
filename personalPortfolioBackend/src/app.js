const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const adminRoutes = require("./routes/admin");
// const config = require("config");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const endpoints = require("./ignition/endpoints");
const myConfig = require("./core/myConfig");
const configMiddleware = require("./middlewares/configMiddleware");
const app = express();

const { frontendEndpoint } = endpoints;
const appPort = myConfig.appConf.port;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
  origin: [frontendEndpoint],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: 'Content-Type,Authorization',
  //exposedHeaders: 'x-auth-token',
  credentials: true,
}));

// Database & Models
require("./ignition/db")();

app.use('/docs', express.static(path.join(__dirname, 'public/docs')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(configMiddleware);

app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

const httpsOptions = {
  key: fs.readFileSync('/etc/nginx/ssl-certificates/api.aslidunal.com.key'),
  cert: fs.readFileSync('/etc/nginx/ssl-certificates/api.aslidunal.com.crt')
};

https.createServer(httpsOptions, app).listen(appPort, () => {
  console.log("Listening port on " + appPort);
});

// app.listen(appPort, (error) =>{
//   if(!error)
//       console.log("Server is Successfully Running, and App is listening on port "+ appPort);
//   else 
//       console.log("Error occurred, server can't start", error);
//   }
// );