const { Op } = require("sequelize");
const config = require("config");
// const mailTransporter = require("../helper/send-mail");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

exports.get_register = async (req, resp, next) => {
  try {
    return resp.render("auth/register", {
      title: "register",
    });
  } catch (err) {
    // console.log("Veri çekme hatası: " + err);
    // resp.status(500).send("Veri çekme hatası: " + err.message);
    next(err);
  }
};

exports.post_register = async (req, resp, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  try {
    // const user = await User.findOne({ where: { email: email}});
    // if(user){
    //     req.session.message = { text: "Girdiğiniz e-posta adresi ile daha önce kayıt olunmuş.", class:"warning"};
    //     return req.session.save((err) => {
    //         if (err) {
    //             console.log("session save error", err);
    //             resp.sendStatus(500);
    //         } else {
    //             const url = req.query.returnUrl || "/";
    //             resp.redirect("login");
    //         }
    //     });
    // }

    // throw new Error("hata oluştu");
    const newUser = await User.create({
      fullname: name,
      email: email,
      password: password,
    });
    mailTransporter.sendMail({
      from: config.mailerUser.from,
      to: newUser.email,
      subject: "Hesabınız Oluşturuldu",
      text: "Hesabınız başarılı bir şekilde oluşturuldu.",
    });

    req.session.message = {
      text: "Hesabınıza giriş yapabilirsiniz.",
      class: "success",
    };
    return req.session.save((err) => {
      if (err) {
        console.log("session save error", err);
        resp.sendStatus(500);
      } else {
        const url = req.query.returnUrl || "/";
        resp.redirect("login");
      }
    });
  } catch (err) {
    let msg = "";
    if (
      err.name == "SequelizeValidationError" ||
      err.name == "SequelizeUniqueConstraintError"
    ) {
      for (let e of err.errors) {
        msg += e.message + " ";
      }
      return resp.render("auth/register", {
        title: "register",
        message: { text: msg, class: "danger" },
      });
    } else {
      next(err);
      // msg += "Bilinmeyen bir hata oluştu. Lütfen tekrar deneyiniz.";
      // console.log(err);
    }
    // console.log("register hatası: " + err);
    // resp.status(500).send("register hatası: " + err.message);
  }
};

exports.get_login = async (req, resp, next) => {
  const message = req.session.message;
  delete req.session.message;
  try {
    return resp.render("auth/login", {
      title: "login",
      message: message,
    });
  } catch (err) {
    next(err);
  }
};

exports.post_login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).send({
        status: "error",
        text: "Kullanıcı bulunamadı.",
        class: "danger",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // const userRoles = await user.getRoles({
      //     attributes: ["rolename"],
      //     raw: true
      // });

      // req.session.roles = userRoles.map((role) => role["rolename"]);
      // req.session.isAuth = true;
      // req.session.fullname = user.fullname;
      // req.session.userId = user.id;

      // const authToken = createAuthToken(user);

      // return req.session.save((err) => {
      //     if (err) {
      //         console.log("session save error", err);
      //         resp.sendStatus(500);
      //     } else {
      //         const url = req.query.returnUrl || "/";
      //         console.log(authToken);
      //         resp.header("x-auth-token", authToken).redirect(url);
      //     }
      // });
      return res.status(401).send({
        status: "error",
        text: "E-posta veya parola hatalı.",
        class: "danger",
      });
    }
    const authToken = jwt.sign(
      { _id: user.id, auth: "admin" },
      config.get("tokensecret"),
      { expiresIn: "10m" }
    );
    const expireDate = new Date(Date.now() + 10 * 60 * 1000);
    res
      .cookie("__session", authToken, {
        origin: "https://example-cms.inadayapp.com",
        domain: "inadayapp.com",
        expires: expireDate,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .cookie("checkToken", true, {
        origin: "https://example-cms.inadayapp.com",
        domain: "inadayapp.com",
        expires: expireDate,
        secure: true,
        sameSite: "strict",
      })
      .cookie("user", user.fullname, {
        origin: "https://example-cms.inadayapp.com",
        domain: "inadayapp.com",
        expires: expireDate,
        secure: true,
        sameSite: "strict",
      })
      .send({ status: "success", name: user.fullname });
  } catch (err) {
    res.next(err);
  }
};

exports.get_logout = (req, res, next) => {
  try {
    // return req.session.destroy((err) => {
    //   if (err) {
    //     console.log("session destroy error", err);
    //     resp.sendStatus(500);
    //   } else {
    //     resp.redirect("login");
    //   }
    // });

    // const expireDateOnLogout = new Date(Date.now());
    res
      .clearCookie("__session", {
        origin: "https://example-cms.inadayapp.com",
        domain: "inadayapp.com",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .send({ status: "success" });
  } catch (err) {
    res.send({ status: "error", text: err });
    next(err);
  }
};

exports.get_reset_pass = async (req, resp, next) => {
  const message = req.session.message;
  delete req.session.message;
  try {
    return resp.render("auth/reset-password", {
      title: "Password Reset",
      message: message,
    });
  } catch (err) {
    next(err);
  }
};

exports.post_reset_pass = async (req, resp, next) => {
  const email = req.body.email;
  try {
    var token = crypto.randomBytes(32).toString("hex");
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      req.session.message = {
        text: "Girdiğiniz e-posta adresi bulunamadı.",
        class: "danger",
      };
      return req.session.save((err) => {
        if (err) {
          console.log("session save error", err);
          resp.sendStatus(500);
        } else {
          resp.redirect("reset-password");
        }
      });
    }

    user.resetToken = token;
    user.resetTokenExp = Date.now() + config.passTokenExp * 1000 * 60;
    await user.save();
    mailTransporter.sendMail({
      from: config.mailerUser.from,
      to: email,
      subject: "Reset Password",
      html: `
            <p>Parolanızı güncellemek için aşağıdaki linki kullanın.</p>
            <p>
                <a href="http://127.0.0.1:3000/account/new-password/${token}">Parola Sıfırla</a>
            </p>
            `,
    });

    req.session.message = {
      text: "Parolanızı sıfırlamak için e-posta adresinizi kontrol ediliniz.",
      class: "info",
    };
    return req.session.save((err) => {
      if (err) {
        console.log("session save error", err);
        resp.sendStatus(500);
      } else {
        resp.redirect("login");
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.get_new_pass = async (req, resp, next) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExp: {
          [Op.gt]: Date.now(),
        },
      },
    });

    return resp.render("auth/new-password", {
      title: "New Password",
      userId: user.id,
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

exports.post_new_pass = async (req, resp, next) => {
  const token = req.body.token;
  const userId = req.body.userId;
  const newPassword = req.body.password;

  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExp: {
          [Op.gt]: Date.now(),
        },
        id: userId,
      },
    });
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExp = null;
    await user.save();

    req.session.message = { text: "Parolanız güncellendi", class: "success" };
    return req.session.save((err) => {
      if (err) {
        console.log("session save error", err);
        resp.sendStatus(500);
      } else {
        resp.redirect("login");
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.get_check_auth = async (req, res) => {
  const token = req.cookies.__session;
  console.log("checkAuth");
  if (!token) {
    return res
      .status(200)
      .json({
        status: "error",
        text: "Token bulunamadı. Yetkilendirme reddedildi.",
      });
  }

  jwt.verify(token, config.get("tokensecret"), (err, decodedToken) => {
    if (err) {
      return res
        .status(200)
        .json({
          status: "error",
          text: "Geçersiz token. Yetkilendirme reddedildi.",
        });
    }
    const newAuthToken = jwt.sign(
      { _id: decodedToken._id, auth: "admin" },
      config.get("tokensecret"),
      { expiresIn: "10m" } // Yeni bir token oluşturun, örneğin 1 saatlik
    );

    const expireDate = new Date(Date.now() + 10 * 60 * 1000);
    const userCookie = req.cookies.user;
    res
      .cookie("__session", newAuthToken, {
        origin: "https://example-cms.inadayapp.com",
        domain: "inadayapp.com",
        expires: expireDate,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .cookie("checkToken", true, {
        origin: "https://example-cms.inadayapp.com",
        domain: "inadayapp.com",
        expires: expireDate,
        secure: true,
        sameSite: "strict",
      })
      .cookie("user", userCookie, {
        origin: "https://example-cms.inadayapp.com",
        domain: "inadayapp.com",
        expires: expireDate,
        secure: true,
        sameSite: "strict",
      })
      .status(200)
      .json({ status: "success", text: "Oturum devam ediyor" });
  });
};

createAuthToken = (user) => {
  return jwt.sign({ id: user.id }, "3a4df642-90e4-4a86-8aa0-c401021b095b");
};
