const express = require("express");
const dotenv = require("dotenv");
const color = require("colors");
const bootcamps = require("./routes/bootcamp.js");
const course = require("./routes/course.js");
const logger = require("./middleware/logger.js");
const errorhandler = require("./middleware/errorhandler.js");

//load env vars
dotenv.config({ path: "./config/config.env" });

//mongoose
const connectdb = require("./db.js");

connectdb();

const app = express();
//JSON  PRASER
app.use(express.json());
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
