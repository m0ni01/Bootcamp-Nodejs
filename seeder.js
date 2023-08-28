const mongoose = require("mongoose");
const Bootcamp = require("./models/Bootcamp");
const dotenv = require("dotenv");
const fs = require("fs");
const colors = require("colors");

//load env vars
dotenv.config({ path: "./config/config.env" });

//connect to DB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

//importing bootcamp data
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log("Data Imported".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

//deleting bootcamp data
const delData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log("Data deleted".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -i  will update bootcamp
if (process.argv[2] === "-i") {
  importData();
}
// node seeder.js -d will delete bootcamp
if (process.argv[2] === "-d") {
  delData();
}
