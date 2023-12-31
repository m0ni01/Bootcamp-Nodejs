const mongoose = require("mongoose");
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const User = require("./models/users");
const Review = require("./models/reviews");
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
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

const user = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
);

//importing bootcamp data
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(user);
    await Review.create(reviews);
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
    await Course.deleteMany();
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
