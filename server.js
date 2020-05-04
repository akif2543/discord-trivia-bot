const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const morgan = require('morgan');
const errorHandler = require('errorhandler');
const cors = require('cors');
require("dotenv").config();
const playerRoutes = require("./routes/players");
const questionRoutes = require("./routes/questions");

const db = process.env.MONGODB_URI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB is connected.");
  })
  .catch((err) => {
    console.log("error", err);
  });

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(errorHandler());


app.use('/players', playerRoutes);
app.use("/questions", questionRoutes);

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`) );