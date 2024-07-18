const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const path = require("path");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const config = require("config");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000","https://reactjs-nine-vert.vercel.app", "https://example-cms.inadayapp.com"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: 'Content-Type,Authorization',
  //exposedHeaders: 'x-auth-token',
  credentials: true,
}));

// Database & Models
require("./ignition/db")();

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.get("/", (req, res) => { res.send("Express on Firebase"); });

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/account", authRoutes);

const httpsOptions = {
  key: fs.readFileSync('/etc/nginx/ssl-certificates/example-cms-backend.inadayapp.com.key'),
  cert: fs.readFileSync('/etc/nginx/ssl-certificates/example-cms-backend.inadayapp.com.crt')
};

https.createServer(httpsOptions, app).listen(config.get("appArgs.port"), () => {
  console.log("Listening port on " + config.get("appArgs.port"));
});