const express = require("express");
const bodyParser = require("body-parser");
const bucketRouter = require('./routes/bucket.router')''
const path = require("path");
const app = express();

app.use(bodyParser.json())
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(`${__dirname}/public`));


app.use("/",bucketRouter);

app.use("/", (req, res) => {
    res.status(200).render("index");
  });


module.exports = app;