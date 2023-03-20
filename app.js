const express = require("express");
const bodyParser = require("body-parser");
const S3Operation = require("./routes/s3Operation.router");
const userRouter = require("./routes/user.router")
const app = express();

app.use(bodyParser.json())

 app.use("/",S3Operation);
 app.use("/",userRouter);


module.exports = app;