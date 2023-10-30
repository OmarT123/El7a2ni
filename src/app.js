const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

require("dotenv").config();
const MongoURI = process.env.MONGO_URI;

const {addDoctor, editDoctor,filterAppointmentsForDoctor, createAppointment,myPatients} = require('./Routes/doctorController');
const {
  createPatient,
  createFamilyMember,
  searchForDoctorByNameSpeciality,
  filterAppointmentsForPatient,
  getDoctors,
  getADoctor
} = require("./Routes/patientController");
const {
  addHealthPackage,
  editHealthPackage,
  deleteHealthPackage,
  viewDocInfo,
} = require("./Routes/adminController.js");

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


//Admin
app.post("/addHealthPackage", addHealthPackage);
app.put("/editHealthPackage", editHealthPackage);
app.delete("/deleteHealthPackage", deleteHealthPackage);
app.get("/viewDocInfo", viewDocInfo);
app.post("/addHealthPackage",addHealthPackage);

//Patient
app.post("/addPatient", createPatient);
app.post("/addFamilyMember", createFamilyMember);
app.get("/searchDoctor", searchForDoctorByNameSpeciality);
app.get("/filterAppointmentsForPatient", filterAppointmentsForPatient);
app.get("/viewDoctors",getDoctors);
app.get("/viewADoctor",getADoctor)

//Doctor
app.get("/filterAppointmentsForDoctor", filterAppointmentsForDoctor);
app.post("/addAppointment", createAppointment);
app.post("/addDoctor", addDoctor);
app.put("/editDoctor",editDoctor);
app.get("/viewmypatients",myPatients);
app.get("/viewDocInfo", viewDocInfo);
