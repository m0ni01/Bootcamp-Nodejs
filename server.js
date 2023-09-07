const express = require("express");
const dotenv = require("dotenv");
const color = require("colors");
const bootcamps = require("./routes/bootcamp.js");
const path = require("path");
const course = require("./routes/course.js");
const logger = require("./middleware/logger.js");
const errorhandler = require("./middleware/errorhandler.js");
const fileUpload = require("express-fileupload");

//load env vars
dotenv.config({ path: "./config/config.env" });

//mongoose
const connectdb = require("./db.js");

connectdb();

const app = express();
//JSON  PRASER
app.use(express.json());

//file upload
app.use(fileUpload());

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//use for logging request on server
app.use(logger);

const PORT = process.env.PORT || 5000;

// bootcamps  API wiht help of router
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", course);

//custom error handling
app.use(errorhandler);

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

process.on("uncaughtException", (err, promise) => {
  console.log(`error ${err.message}`.red);
  server.close(() => process.exit());
});
