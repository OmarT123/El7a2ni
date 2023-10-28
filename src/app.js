const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();
const MongoURI = process.env.MONGO_URI;

const patient = require("./Models/Patient");
const {
  createPatient,
  createFamilyMember,
} = require("./Routes/patientController");

const app = express();
const port = process.env.PORT || "8000";

mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    app.listen(port, () => {
      console.log(`Listening to requests on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

app.use(express.json());
app.post("/addPatient", createPatient);
app.post("/addFamilyMember", createFamilyMember);
