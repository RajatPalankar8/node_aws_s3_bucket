const express = require("express");
const bodyParser = require("body-parser");
const S3Operation = require("./routes/s3Operation.router")
const app = express();

app.use(bodyParser.json())

 app.use("/",S3Operation);

module.exports = app;