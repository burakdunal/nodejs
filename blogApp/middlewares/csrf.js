const getCsrfToken = (req, resp, next) => {
    resp.locals.csrfToken = req.csrfToken();
    next();
}

module.exports = getCsrfToken;