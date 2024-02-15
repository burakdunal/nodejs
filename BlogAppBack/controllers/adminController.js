const jwt = require("jsonwebtoken");

exports.get_admin = (req, res) => {
    const title = "admin";
    const data = "admin sayfasına hoş geldin";
    const adminId = 1;
    const token = jwt.sign({ _id: adminId, auth:"admin"}, "jwt-Private-Key");
    res.header("x-auth-token", token).send({title, data});
};

exports.post_product = (req, res) => {
    const token = req.header("x-auth-token");
    if(!token){
        return res.status(401).send("yetkiniz yok");
    }

    try{
        const decodedToken = jwt.verify(token, "jwt-Private-Key");
        const title = "post product";
        const data = "post product sayfası";
        res.send({ title, data});
    }
    catch(err){
        return res.status(400).send("token hatalı.");
    }
};