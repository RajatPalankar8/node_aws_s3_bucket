const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./routes/user.router");
const path = require("path");
const app = express();

app.use(bodyParser.json())
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(`${__dirname}/public`));


app.use("/",S3Operation);
app.use("/",userRouter);
app.use("/",SimilarToS3);

app.use("/", (req, res) => {
    res.status(200).render("index");
  });


module.exports = app;