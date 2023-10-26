const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();
const MongoURI = process.env.MONGO_URI;

const {createPatient}= require('./Routes/patientController')

const app = express();
const port = process.env.PORT || "8000";

//App variables
const patient = require('./Models/Patient');
// #Importing the userController





mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

app.use(express.json())
app.post("/addPatient",createPatient);
