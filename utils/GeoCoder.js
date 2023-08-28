const NodeGeocoder = require("node-geocoder");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const options = {
  provider: process.env.GEO_CODER_PROVIDER,
  apiKey: process.env.GEO_CODER_API,
  formatter: null,
  httpAdapter: "https",
};

const geoCoder = NodeGeocoder(options);

module.exports = geoCoder;
