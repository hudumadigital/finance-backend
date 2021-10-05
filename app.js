const express = require('express');
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const authRoute = require("./routes/auth.route");
const customerRoute = require("./routes/customer.route");

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Requested-With, Authorization"
  );
  next();
});


//ROUTES USAGE
app.use("/account", authRoute);
app.use("/bank/", customerRoute);

app.use("/", (req, res, next) => {
  res.status(200).json({api : "Welcome to Finance Backend"});
  next();
});
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err._message ? err._message : err.message;
  const notSuccess = err.notSuccess ? err.notSuccess : false;
  if (err) {
    res.status(status).json({ message: message, notSuccess: notSuccess });
  }
  // DISPLAY ERROR MESSAGE DURING DEVELOPMENT
  console.log(err);
  next();
});

mongoose
  .connect(MONGODB_URI, mongooseOptions)
  .then((result) => {
    app.listen(PORT, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Server running on PORT: " + PORT);
    });
  })
  .catch((err) => {
    console.log("Error occurred to DB");
    console.log(err);
    app.listen(PORT, null, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Server running without DB");
    });
  });
