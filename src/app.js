const express = require("express");
const mongoose = require("mongoose");
const schedule = require('node-schedule');
mongoose.set("strictQuery", false);
const cookieParser = require('cookie-parser');
const appointmentModel = require("./Models/Appointment.js")


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
  rejectContract,
  viewPatientPrescriptions,
  selectPrescriptionDoctor,
  addDosage,
  addToPrescription,
  viewAllMedicines,
  deleteFromPrescription
} = require("./Routes/doctorController");


const {
  addPharmacist,
  searchMedicinePharmacist,
  addMedicine,
  editMedicine,
  filterByMedicinalUsePharmacist,
  medicinequantityandsales,
  viewMedicine,
  uploadMedicineImage
} = require("./Routes/pharmacistController");

const {
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
  buyHealthPackage,
  reserveAppointment,
  getHealthPackageForPatient,
  viewFreeAppointments,
  getAnAppointment,
  uploadHealthRecord,
  getHealthRecords,
  viewMySubscribedHealthPackage,
  CancelSubscription,
  ViewMyWallet,
  viewFreeAppointmentsByName,
  getHealthPackageForFamily,
  searchMedicinePatient,
  filterByMedicinalUsePatient,
  addPatient,
  addToCart,
  viewMyCart,
  removeFromCart,
  decreaseByOne,
  increaseByOne,
  payWithCard,
  payWithWallet,
  sendCheckoutMail,
  getAllAddresses,
  cashOnDelivery,
  pastOrders,
  cancelOrder,
  deleteHealthRecord,
  cancelAppointment,
  addPrescriptionToCart
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
  unapprovedPharmacists,
  getPharmacist,
  deletePharmacist,
  filterByMedicinalUseAdmin,
  searchMedicineAdmin,
  getPatient,
  getAllPharmacists,
  viewAllPatients,
  viewAllPharmacists,
  rejectPharmacist,
  acceptPharmacist
} = require("./Routes/adminController.js");


const{ login, logout ,changePassword ,getUserFromTokenMiddleware ,resetPassword, resetPasswordWithOTP,loginAuthentication} =require("./Routes/userController");


const app = express();
const port = process.env.PORT || "8000";
app.use(express.json({ limit: '5000mb' }));
app.use(express.urlencoded({ limit: '5000mb', extended: true }));


mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    app.listen(port, async () => {
      await appointmentModel.cancelPastAppointments();
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
app.delete("/deleteDoctor",getUserFromTokenMiddleware,deleteDoctor);
app.delete("/deleteAdmin",getUserFromTokenMiddleware,deleteAdmin);
app.get("/getAllHealthPackages",getUserFromTokenMiddleware,getAllHealthPackages)
app.get("/getHealthPackage",getUserFromTokenMiddleware,getHealthPackage)
app.get("/getAllAdmins",getUserFromTokenMiddleware,getAllAdmins);
app.get("/getAllDoctors",getUserFromTokenMiddleware,getAllDoctors);
app.put("/acceptDoctor",acceptDoctor);
app.put("/rejectDoctor",rejectDoctor);
app.get("/getADoctor", getADoctor);
app.put("/rejectPharmacist",rejectPharmacist);
app.put("/acceptPharmacist",acceptPharmacist);
app.get("/getUnapprovedPharmacists", getUserFromTokenMiddleware,unapprovedPharmacists);
app.get("/filterByMedicinalUseAdmin", getUserFromTokenMiddleware,filterByMedicinalUseAdmin);
app.delete("/deletePharmacist", getUserFromTokenMiddleware,deletePharmacist);
app.delete("/deletePatient",getUserFromTokenMiddleware, deletePatient);
app.get("/searchMedicineAdmin", getUserFromTokenMiddleware,searchMedicineAdmin);
app.post("/addAdmin", getUserFromTokenMiddleware,addAdmin);
app.get("/getPatient",getUserFromTokenMiddleware ,getPatient);
app.get("/getAllPatients",getUserFromTokenMiddleware,getAllPatients);
app.get("/getAllPharmacists", getUserFromTokenMiddleware,getAllPharmacists);
app.get("/viewAllPatients", getUserFromTokenMiddleware,viewAllPatients);
app.get("/viewAllPharmacists", getUserFromTokenMiddleware,viewAllPharmacists);
app.get("/viewPharmacist", getUserFromTokenMiddleware,getPharmacist);



//Patient
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
app.get("/searchMedicinePatient",getUserFromTokenMiddleware ,searchMedicinePatient);
app.delete("/removePatient", getUserFromTokenMiddleware,deletePatient);
app.get("/filterByMedicinalUsePatient",getUserFromTokenMiddleware,filterByMedicinalUsePatient);
app.get("/viewMedicine",getUserFromTokenMiddleware,viewMedicine );
app.post("/addPatient", addPatient);
app.post("/addToCart",getUserFromTokenMiddleware,addToCart);
app.get("/viewMyCart",getUserFromTokenMiddleware,viewMyCart);
app.put("/removeFromCart",getUserFromTokenMiddleware,removeFromCart);
app.put("/decreaseByOne",getUserFromTokenMiddleware,decreaseByOne);
app.put("/increaseByOne",getUserFromTokenMiddleware,increaseByOne);
app.get("/payWithCard",getUserFromTokenMiddleware, payWithCard);
app.get("/payWithWallet",getUserFromTokenMiddleware, payWithWallet);
app.get("/sendCheckoutMail", getUserFromTokenMiddleware,sendCheckoutMail);
app.get("/getAllAddresses",getUserFromTokenMiddleware ,getAllAddresses);
app.get("/cashOnDelivery",getUserFromTokenMiddleware, cashOnDelivery);
app.get("/pastOrders",getUserFromTokenMiddleware,pastOrders);
app.put("/cancelOrder",getUserFromTokenMiddleware,cancelOrder);
app.put("/deleteHealthRecord", getUserFromTokenMiddleware, deleteHealthRecord);
app.put("/cancelAppointment", getUserFromTokenMiddleware, cancelAppointment);
app.post("/addPrescriptionToCart", getUserFromTokenMiddleware, addPrescriptionToCart);

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
app.get("/viewDoctorAppointments", getUserFromTokenMiddleware, viewDoctorAppointments); 
app.post("/addAppointmentSlots",getUserFromTokenMiddleware, addAppointmentSlots);
app.get("/ViewDoctorWallet",getUserFromTokenMiddleware,ViewDoctorWallet);
app.put("/acceptContract", getUserFromTokenMiddleware, acceptContract);
app.put("/rejectContract", getUserFromTokenMiddleware, rejectContract);
app.get("/viewPatientPrescriptions",getUserFromTokenMiddleware,viewPatientPrescriptions);
app.get("/selectPrescriptionDoctor",getUserFromTokenMiddleware,selectPrescriptionDoctor);
app.put("/addDosage",addDosage);
app.post("/addToPrescription",getUserFromTokenMiddleware,addToPrescription);
app.get("/viewAllMedicines",getUserFromTokenMiddleware,viewAllMedicines);
app.post("/deleteFromPrescription",getUserFromTokenMiddleware,deleteFromPrescription)

//Pharmacist
app.post("/addPharmacist",addPharmacist);
app.get("/searchMedicinePharmacist", getUserFromTokenMiddleware,searchMedicinePharmacist);
app.get("/viewAPharmacist",getUserFromTokenMiddleware, getPharmacist);
app.put("/editMedicine",getUserFromTokenMiddleware, editMedicine);
app.post("/addMedicine", getUserFromTokenMiddleware,addMedicine);
app.get("/filterByMedicinalUsePharmacist",getUserFromTokenMiddleware, filterByMedicinalUsePharmacist);
app.get("/medicinequantityandsales",getUserFromTokenMiddleware, medicinequantityandsales);
app.put("/uploadMedicineImage", uploadMedicineImage);

//user 

app.post('/login', login);
app.get('/logout',getUserFromTokenMiddleware,logout);
app.get('/getUserFromTokenMiddleware',getUserFromTokenMiddleware);
app.put('/changePassword', getUserFromTokenMiddleware, changePassword);
app.put('/resetPassword', resetPassword);
app.put('/resetPasswordWithOTP',resetPasswordWithOTP);
app.get('/loginAuthentication',loginAuthentication);