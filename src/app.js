const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const cookieParser = require('cookie-parser');

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


const{ login, logout ,changePassword ,getUserFromTokenMiddleware ,resetPassword, resetPasswordWithOTP,loginAuthentication} =require("./Routes/userController");


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
app.use(cookieParser());

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
app.post("/addFamilyMember",getUserFromTokenMiddleware, createFamilyMember);
app.get("/searchDoctor",getUserFromTokenMiddleware, searchForDoctorByNameSpeciality);
app.get("/filterAppointmentsForPatient",getUserFromTokenMiddleware, filterAppointmentsForPatient);
app.get("/selectDoctorFromFilterSearch",getUserFromTokenMiddleware,selectDoctorFromFilterSearch);
app.get("/getFamilyMembers",getUserFromTokenMiddleware, getFamilyMembers);
app.get("/filterPrescriptionByDateDoctorStatus",getUserFromTokenMiddleware,filterPrescriptionByDateDoctorStatus);
app.get("/filterDoctorsSpecialityDate", getUserFromTokenMiddleware,filterDoctorsSpecialityDate);
app.get("/viewMyPrescriptions",getUserFromTokenMiddleware,viewMyPrescriptions);
app.get("/selectPrescription",getUserFromTokenMiddleware,selectPrescription);
app.get("/allDoctors",getUserFromTokenMiddleware, getDoctors)


//Doctor
app.get("/filterAppointmentsForDoctor",getUserFromTokenMiddleware ,filterAppointmentsForDoctor);
app.post("/addAppointment",getUserFromTokenMiddleware,createAppointment);
app.post("/addDoctor", addDoctor);
app.put("/editDoctor",getUserFromTokenMiddleware, editDoctor);
app.get("/viewmypatients",getUserFromTokenMiddleware, myPatients);
app.get("/viewDocInfo", getUserFromTokenMiddleware,viewDocInfo);
app.get("/filterPatientsByAppointments",getUserFromTokenMiddleware, filterPatientsByAppointments);
app.get("/viewPatient", getUserFromTokenMiddleware,viewPatient);
app.get("/viewmypatientsbyname",getUserFromTokenMiddleware,exactPatients);
app.post("/createPrescription",getUserFromTokenMiddleware,createPrescription);


//user 

app.post('/login', login);
app.get('/logout',getUserFromTokenMiddleware,logout);
app.get('/getUserFromTokenMiddleware',getUserFromTokenMiddleware);
app.put('/changePassword', getUserFromTokenMiddleware, changePassword);
app.put('/resetPassword', resetPassword);
app.put('/resetPasswordWithOTP',resetPasswordWithOTP);
app.get('/loginAuthentication',loginAuthentication);