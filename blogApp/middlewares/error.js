const { winstonLogger, winstonLogger2} = require("./logger");

module.exports = (err, req, resp, next) => {
    winstonLogger.log("error",err.message);
    winstonLogger2.log("error",err.message);

    // winstonLogger2.log({
    //     level: 'error',
    //     message: err.message,
    // });
    // resp.status(500).send("hata oluştu.");
    resp.redirect("/error/500");
};