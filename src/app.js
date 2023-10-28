const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();
const MongoURI = process.env.MONGO_URI;

const patient = require("./Models/Patient");
const {
  createPatient,
  createFamilyMember,getDoctors,getADoctor
} = require("./Routes/patientController");
const {
  addHealthPackage,
  editHealthPackage,
  deleteHealthPackage,
} = require("./Routes/adminController.js");
const app = express();
const port = process.env.PORT || "8000";

//App variables
//const patient = require('./Models/Patient');
const hPackage = require('./Models/HealthPackage');
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
app.put("/addFamilyMember", createFamilyMember);
app.post("/addHealthPackage",addHealthPackage);
app.get("/viewDoctors",getDoctors);
app.get("/viewADoctor",getADoctor)