const moment = require("moment");
const logger = (req, res, next) => {
  console.log(
    `${req.method}   ${req.originalUrl}  ${req.ip}  ${moment().format()}`
  );
  next();
};

module.exports = logger;
