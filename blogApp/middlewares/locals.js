module.exports = (req, resp, next) => {
    // resp.locals.isAuth = req.session.isAuth;
    // resp.locals.fullname = req.session.fullname;
    // resp.locals.isAdmin = req.session.roles ? req.session.roles.includes("admin") : false;
    // resp.locals.isModerator = req.session.roles ? req.session.roles.includes("moderator") : false;
    resp.locals.csrfToken = req.csrfToken();
    resp.locals.isAuth = req.session ? req.session.isAuth : false;
    resp.locals.fullname = req.session ? req.session.fullname : '';
    resp.locals.isAdmin = req.session ? (req.session.roles ? req.session.roles.includes("admin") : false) : false;
    resp.locals.isModerator = req.session ? (req.session.roles ? req.session.roles.includes("moderator") : false) : false;
    next();
};