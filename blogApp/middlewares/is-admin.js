const isAdmin = (req, resp, next) => {
    if(!req.session.isAuth){
        return resp.redirect("/account/login?returnUrl=" + req.originalUrl);
    }
    if(!req.session.roles.includes("admin")){
        req.session.message = {text: "Yetkili bir kullanıcı ile oturum açınız.", class:"warning"};
        return req.session.save((err) => {
            if (err) {
                console.log("session save error", err);
                resp.sendStatus(500);
            } else {
                resp.redirect("/account/login?returnUrl=" + req.originalUrl);
            }
        });
    }
    next();
};

module.exports = isAdmin;