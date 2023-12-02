const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

require("dotenv").config();
const MongoURI = process.env.MONGO_URI;

const {
  addDoctor,
  editDoctor,
  filterAppointmentsForDoctor,
  createAppointment,
  myPatients,
  filterPatientsByAppointments,
  viewPatient,
  createPrescription,
  exactPatients,
} = require("./Routes/doctorController");
const {
  addPatient,
  createFamilyMember,
  searchForDoctorByNameSpeciality,
  filterAppointmentsForPatient,
  getFamilyMembers,
  filterPrescriptionByDateDoctorStatus,
  filterDoctorsSpecialityDate,
  viewMyPrescriptions,
  selectPrescription,
  selectDoctorFromFilterSearch,
  getDoctors
} = require("./Routes/patientController");
const {
  addAdmin,
  addHealthPackage,
  editHealthPackage,
  deleteHealthPackage,
  viewDocInfo,
  deletePatient,
  deleteDoctor,
  deleteAdmin,
  getAllHealthPackages,
  getHealthPackage ,
  getAllAdmins,
  getAllDoctors,
  getAllPatients
} = require("./Routes/adminController.js");


const{ login, logout} =require("./Routes/userController");


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

//Admin
app.post("/addHealthPackage", addHealthPackage);
app.put("/editHealthPackage", editHealthPackage);
app.delete("/deleteHealthPackage", deleteHealthPackage);
app.get("/viewDocInfo", viewDocInfo);
app.delete("/deletePatient",deletePatient);
app.delete("/deleteDoctor",deleteDoctor);
app.delete("/deleteAdmin",deleteAdmin);
app.post("/addAdmin",addAdmin);
app.get("/getAllHealthPackages",getAllHealthPackages)
app.get("/getHealthPackage",getHealthPackage)
app.get("/getAllAdmins",getAllAdmins);
app.get("/getAllDoctors",getAllDoctors);
app.get("/getAllPatients",getAllPatients);

//Patient
app.post("/addPatient", addPatient);
app.post("/addFamilyMember", createFamilyMember);
app.get("/searchDoctor", searchForDoctorByNameSpeciality);
app.get("/filterAppointmentsForPatient", filterAppointmentsForPatient);
app.get("/selectDoctorFromFilterSearch",selectDoctorFromFilterSearch);
app.get("/getFamilyMembers", getFamilyMembers);
app.get("/filterPrescriptionByDateDoctorStatus",filterPrescriptionByDateDoctorStatus);
app.get("/filterDoctorsSpecialityDate", filterDoctorsSpecialityDate);
app.get("/viewMyPrescriptions",viewMyPrescriptions);
app.get("/selectPrescription",selectPrescription);
app.get("/allDoctors", getDoctors)


//Doctor
app.get("/filterAppointmentsForDoctor", filterAppointmentsForDoctor);
app.post("/addAppointment", createAppointment);
app.post("/addDoctor", addDoctor);
app.put("/editDoctor", editDoctor);
app.get("/viewmypatients", myPatients);
app.get("/viewDocInfo", viewDocInfo);
app.get("/filterPatientsByAppointments", filterPatientsByAppointments);
app.get("/viewPatient", viewPatient);
app.get("/viewmypatientsbyname",exactPatients);
app.post("/createPrescription",createPrescription);


//user 

app.post('/login', login);
app.get('/logout', logout);