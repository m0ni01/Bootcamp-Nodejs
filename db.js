const mongoose = require("mongoose");

const connectdb = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URL);
  console.log(`conencted to database `.cyan.underline.bold);
};
module.exports = connectdb;
