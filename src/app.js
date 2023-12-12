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
  addAppointmentSlots,
  ViewDoctorWallet,
  viewDoctorAppointments,
  acceptContract,
  rejectContract
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
  getDoctors,
  linkFamilyMemberAccount,
  viewPatientAppointments,
  payWithCard,
  payWithWallet,
  buyHealthPackage,
  reserveAppointment,
  sendCheckoutMail,
  getHealthPackageForPatient,
  viewFreeAppointments,
  getAnAppointment,
  uploadHealthRecord,
  getHealthRecords,
  viewMySubscribedHealthPackage,
  CancelSubscription,
  ViewMyWallet,
  viewFreeAppointmentsByName,
  getHealthPackageForFamily
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
  getAllPatients,
  acceptDoctor,
  rejectDoctor,
  getADoctor,
} = require("./Routes/adminController.js");


const{ login, logout ,changePassword ,getUserFromTokenMiddleware ,resetPassword, resetPasswordWithOTP,loginAuthentication} =require("./Routes/userController");


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
app.use(cookieParser());

//Admin
app.post("/addHealthPackage", getUserFromTokenMiddleware,addHealthPackage);
app.put("/editHealthPackage",getUserFromTokenMiddleware, editHealthPackage);
app.delete("/deleteHealthPackage",getUserFromTokenMiddleware, deleteHealthPackage);
app.get("/viewDocInfo", getUserFromTokenMiddleware,viewDocInfo);
app.delete("/deletePatient",getUserFromTokenMiddleware,deletePatient);
app.delete("/deleteDoctor",getUserFromTokenMiddleware,deleteDoctor);
app.delete("/deleteAdmin",getUserFromTokenMiddleware,deleteAdmin);
app.post("/addAdmin",getUserFromTokenMiddleware,addAdmin);
app.get("/getAllHealthPackages",getUserFromTokenMiddleware,getAllHealthPackages)
app.get("/getHealthPackage",getUserFromTokenMiddleware,getHealthPackage)
app.get("/getAllAdmins",getUserFromTokenMiddleware,getAllAdmins);
app.get("/getAllDoctors",getUserFromTokenMiddleware,getAllDoctors);
app.get("/getAllPatients",getUserFromTokenMiddleware,getAllPatients);
app.put("/acceptDoctor",acceptDoctor);
app.put("/rejectDoctor",rejectDoctor);
app.get("/getADoctor", getADoctor);

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
app.get("/allDoctors",getUserFromTokenMiddleware, getDoctors);
app.get("/viewPatientAppointments", viewPatientAppointments);
app.post("/linkFamilyMember", linkFamilyMemberAccount);
app.get("/viewMySubscribedHealthPackage",getUserFromTokenMiddleware,viewMySubscribedHealthPackage);
app.put("/CancelSubscription",getUserFromTokenMiddleware,CancelSubscription);
app.get("/ViewMyWallet",getUserFromTokenMiddleware,ViewMyWallet)
app.get("/viewPatientAppointments", viewPatientAppointments);
app.get("/payWithCard",getUserFromTokenMiddleware, payWithCard)
app.get("/payWithWallet", getUserFromTokenMiddleware, payWithWallet)
app.put("/buyHealthPackage",getUserFromTokenMiddleware, buyHealthPackage)
app.put("/reserveAppointment", getUserFromTokenMiddleware,reserveAppointment)
app.get("/sendCheckoutMail", getUserFromTokenMiddleware,sendCheckoutMail)
app.get("/getHealthPackageForPatient", getHealthPackageForPatient)
app.get("/viewFreeAppointments",getUserFromTokenMiddleware, viewFreeAppointments)
app.get("/getAnAppointment", getAnAppointment)
app.put("/uploadHealthRecord",getUserFromTokenMiddleware, uploadHealthRecord);
app.get("/getHealthRecords",getUserFromTokenMiddleware, getHealthRecords);
app.get("/viewFreeAppointmentsByName",getUserFromTokenMiddleware, viewFreeAppointmentsByName)

app.get("/getHealthPackageForFamily",getUserFromTokenMiddleware, getHealthPackageForFamily)
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
app.get("/viewDoctorAppointments", viewDoctorAppointments); 
app.post("/addAppointmentSlots",getUserFromTokenMiddleware, addAppointmentSlots);
app.get("/ViewDoctorWallet",getUserFromTokenMiddleware,ViewDoctorWallet)
app.put("/acceptContract", getUserFromTokenMiddleware, acceptContract)
app.put("/rejectContract", getUserFromTokenMiddleware, rejectContract)

//user 

app.post('/login', login);
app.get('/logout',getUserFromTokenMiddleware,logout);
app.get('/getUserFromTokenMiddleware',getUserFromTokenMiddleware);
app.put('/changePassword', getUserFromTokenMiddleware, changePassword);
app.put('/resetPassword', resetPassword);
app.put('/resetPasswordWithOTP',resetPasswordWithOTP);
app.get('/loginAuthentication',loginAuthentication);