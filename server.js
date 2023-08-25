const express = require("express");
const dotenv = require("dotenv");
const color = require("colors");
const bootcamps = require("./routes/bootcamp.js");
const logger = require("./logger.js");

//load env vars
dotenv.config({ path: "./config/config.env" });

//mongoose
const connectdb = require("./db.js");

connectdb();

const app = express();
app.use(express.json());
app.use(logger);

const PORT = process.env.PORT || 5000;

// bootcamps api
app.use("/api/v1/bootcamps", bootcamps);

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
