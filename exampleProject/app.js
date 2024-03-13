const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const path = require("path");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: 'Content-Type,Authorization,x-auth-token',
  exposedHeaders: 'x-auth-token',
  credentials: true,
}));

//Database & Models
require("./ignition/db")();

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/account",authRoutes);

app.listen(3500, () => {
  console.log("Listening port on 3500");
})