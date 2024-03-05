const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

app.use(express.json());

app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
}));

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

app.listen(3500, () => {
    console.log("Listening port on 3500");
})