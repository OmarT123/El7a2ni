const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();
const MongoURI = process.env.MONGO_URI;

const patient = require('./Models/Patient');
const {createPatient,createFamilyMember,filterAppointmentsForPatient}= require('./Routes/patientController');
const {filterAppointmentsForDoctor, createAppointment}= require('./Routes/doctorController');



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


app.use(express.json())

//Patient
app.post("/addPatient",createPatient);
app.put("/addFamilyMember", createFamilyMember);
app.get("/filterAppointmentsForPatient", filterAppointmentsForPatient);


//Doctor
app.get("/filterAppointmentsForDoctor", filterAppointmentsForDoctor);
app.post("/addAppointment", createAppointment);

