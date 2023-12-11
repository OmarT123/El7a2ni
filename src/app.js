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
  addAppointmentSlots,
  ViewDoctorWallet,
  viewDoctorAppointments,
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
app.put("/acceptDoctor",acceptDoctor);
app.put("/rejectDoctor",rejectDoctor);
app.get("/getADoctor", getADoctor);

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
app.get("/viewPatientAppointments", viewPatientAppointments);
app.post("/linkFamilyMember", linkFamilyMemberAccount);
app.get("/viewMySubscribedHealthPackage",viewMySubscribedHealthPackage);
app.put("/CancelSubscription",CancelSubscription);
app.get("/ViewMyWallet",ViewMyWallet)
app.get("/viewPatientAppointments", viewPatientAppointments);
app.get("/payWithCard", payWithCard)
app.get("/payWithWallet", payWithWallet)
app.put("/buyHealthPackage", buyHealthPackage)
app.put("/reserveAppointment", reserveAppointment)
app.get("/sendCheckoutMail", sendCheckoutMail)
app.get("/getHealthPackageForPatient", getHealthPackageForPatient)
app.get("/viewFreeAppointments", viewFreeAppointments)
app.get("/getAnAppointment", getAnAppointment)
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
app.get("/viewDoctorAppointments", viewDoctorAppointments); 
app.post("/addAppointmentSlots", addAppointmentSlots);
app.get("/ViewDoctorWallet",ViewDoctorWallet)