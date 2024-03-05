const winstonLogger = require("./logger");

module.exports = (err, req, resp, next) => {
    winstonLogger.log("error: " + err.message);
    resp.status(500).redirect('/error/500');
};