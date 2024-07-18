const endpoints = require('../ignition/endpoints');

const configMiddleware = (req, res, next) => {
  req.endpoints = endpoints;
  next();
};

module.exports = configMiddleware;
