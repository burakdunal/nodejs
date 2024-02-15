const UrlProtection = (req, resp, next) => {
    if(!req.session.isAuth){
        return resp.redirect("/account/login?returnUrl=" + req.originalUrl);
    }
    next();
};

module.exports = UrlProtection;