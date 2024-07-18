const jwt = require('jsonwebtoken');
const config = require("config");

// Kullanıcı doğrulama middleware'ı
const isAuth = (req, res, next) => {

  const token = req.cookies.__session;

  if (!token) {
    return res.status(401).json({ status: "error", text: 'Token bulunamadı. Yetkilendirme reddedildi.' });
  }

  // Token doğrulama
  jwt.verify(token, config.get("tokensecret"), (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ status: "error", text: 'Geçersiz token. Yetkilendirme reddedildi.' });
    }

    // Token doğrulandıysa, kullanıcı bilgisini request objesine ekle
    req.user = decodedToken;
    next();
  });
};

module.exports = isAuth;