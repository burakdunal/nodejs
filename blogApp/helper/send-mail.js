const nodemailer = require("nodemailer");
const config = require("../core/myConfig");

var mailTransporter = nodemailer.createTransport({
    host: config.mailerUser.host,
    secureConnection: true,
    port: config.mailerUser.port,
    tls: {
        chiphers: 'SSLv3'
    },
    auth: {
        user: config.mailerUser.username,
        pass: config.mailerUser.password
    }
});

module.exports = mailTransporter;