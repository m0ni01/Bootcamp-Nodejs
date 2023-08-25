// const { MongoClient } = require("mongodb");

//const { mongo } = require("mongoose");

// const client = new MongoClient(process.env.MONGO_URL);

// const connectdb = async () => {
//   const conn = await client.connect(process.env.MONGO_URL);

//   console.log(`conencted to database `.cyan.underline.bold);
// };

// module.exporbts = connectd;

const mongoose = require("mongoose");

const connectdb = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URL);
  console.log(`conencted to database `.cyan.underline.bold);
};
module.exports = connectdb;
