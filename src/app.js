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
  viewDoctorAppointments,  //new Req.45//
} = require("./Routes/doctorController");
const {
  createPatient,
  createFamilyMember,
  searchForDoctorByNameSpeciality,
  filterAppointmentsForPatient,
  getFamilyMembers,
  filterPrescriptionByDateDoctorStatus,
  filterDoctorsSpecialityDate,
  viewMyPrescriptions,
  selectPrescription,
  selectDoctorFromFilterSearch,
  getDoctors,
  viewPatientAppointments, //new Req.45//
  uploadHealthRecord,
  getHealthRecords,
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

const app = express();
const port = process.env.PORT || "8000";
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
app.post("/addPatient", createPatient);
app.post("/addFamilyMember", createFamilyMember);
app.get("/searchDoctor", searchForDoctorByNameSpeciality);
app.get("/filterAppointmentsForPatient", filterAppointmentsForPatient);
app.get("/selectDoctorFromFilterSearch",selectDoctorFromFilterSearch);
app.get("/getFamilyMembers", getFamilyMembers);
app.get("/filterPrescriptionByDateDoctorStatus",filterPrescriptionByDateDoctorStatus);
app.get("/filterDoctorsSpecialityDate", filterDoctorsSpecialityDate);
app.get("/viewMyPrescriptions",viewMyPrescriptions);
app.get("/selectPrescription",selectPrescription);
app.get("/allDoctors", getDoctors);
app.get("/viewPatientAppointments", viewPatientAppointments); //new Req.45//
app.put("/uploadHealthRecord", uploadHealthRecord);
app.get("/getHealthRecords", getHealthRecords);



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
app.get("/viewDoctorAppointments", viewDoctorAppointments); //new Req.45//
