const express = require("express");
const dotenv = require("dotenv");
const color = require("colors");
const path = require("path");
const logger = require("./middleware/logger.js");
const errorhandler = require("./middleware/errorhandler.js");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

//importing routes
const auth = require("./routes/auth.js");
const course = require("./routes/course.js");
const bootcamps = require("./routes/bootcamp.js");

//load env vars
dotenv.config({ path: "./config/config.env" });

//mongoose
const connectdb = require("./db.js");

connectdb();

const app = express();
//JSON  PRASER
app.use(express.json());

//cookie parser
app.use(cookieParser());
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
app.use("/api/v1/auth", auth);

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
