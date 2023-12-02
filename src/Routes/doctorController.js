const doctorModel = require("../Models/Doctor.js");
const patientModel = require("../Models/Patient.js");
const appointmentModel = require("../Models/Appointment.js");
const adminModel = require("../Models/Admin.js");
const prescriptionModel = require("../Models/Prescription.js");
const userModel = require("../Models/User.js")
const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');

const createPrescription = async(req,res)=>{
  try {
    let prescription = await prescriptionModel.create({filled:req.body.filled, patient:req.body.patient,doctor:req.body.doctor,medicines:req.body.medicines})
    await prescription.save();
    res.send(prescription)
  }catch(err){
    res.send(err.message)
  }
}

const createAppointment = async (req, res) => {
  try {
    let appointment = await appointmentModel.create({
      patient: req.body.patient,
      doctor: req.body.doctor,
      date: req.body.date,
      status: req.body.status,
    });
    await appointment.save();
    res.send(appointment);
  } catch (err) {
    res.send(err.message);
  }
};

const filterAppointmentsForDoctor = async (req, res) => {
  // Need login
  const dateToBeFiltered = req.query.date;
  const statusToBeFiltered = req.query.status;
  const filterQuery = {};

  if (dateToBeFiltered) {
    const dateParam = req.query.date
    const startDate = new Date(dateParam);
    const endDate = new Date(dateParam);
    endDate.setDate(endDate.getDate() + 1);
    filterQuery["date"] = { $gte: startDate, $lt: endDate };
  }

  if (statusToBeFiltered) {
    filterQuery["status"] = statusToBeFiltered;
  }
  if (req.query.id) {
    const id = req.query.id;
    filterQuery["doctor"] = new mongoose.Types.ObjectId(id);
    try {
      const filteredAppointments = await appointmentModel
        .find(filterQuery)
        .populate({ path: "patient" });
      if (filteredAppointments.length === 0) {
        return res.json("No matching appointments found for the Doctor." );
      }
      res.json(filteredAppointments);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving appointments." });
    }
  } else {
    try {
      const filteredAppointments = await appointmentModel.find(filterQuery);
      if (filteredAppointments.length === 0) {
        return res.json("No matching appointments found for the Doctor." );
      } 
      else{
        res.json(filteredAppointments);
      }     
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "No matching appointments found for the Doctor." });
    }
  }
};

const addDoctor = async (req, res) => {
  const {
    username,
    name,
    email,
    password,
    birthDate,
    hourlyRate,
    affiliation,
    educationalBackground,
    speciality
  } = req.body;
  try {
    if(!username){
      return res.status(400).json({ success: false, message: "Username is required. Please enter a valid username!" });
    }
    if(!password){
      return res.status(400).json({ success: false, message: "Password is required. Please enter a valid password!" });
    }
    if(!name){
      return res.status(400).json({ success: false, message: "name is required. Please enter a valid name!" });
    }
    if(!birthDate){
      return res.status(400).json({ success: false, message: "birthDate is required. Please enter a valid birthDate!" });
    }
    if(!rate){
      return res.status(400).json({ success: false, message: "HourlyRate is required. Please enter a valid HourlyRate!" });
    }
    if(!affiliation){
      return res.status(400).json({ success: false, message: "affiliation is required. Please enter a valid affiliation!" });
    }
    if(!educationalBackground){
      return res.status(400).json({ success: false, message: "educationalBackground is required. Please enter a valid educationalBackground!" });
    }
    if(!email){
      return res.status(400).json({ success: false, message: "Email is required. Please enter a valid email!" });
    }
    if(!speciality){
      return res.status(400).json({ success: false, message: "speciality is required. Please enter a valid speciality!" });
    }
    const user = await userModel.findOne({username})
    console.log(user)
    if (user)
    {
      res.json("Username already exists")
    }
    else {
      const salt = await bcrypt.genSalt();
      const encryptedPassword = await bcrypt.hash(password ,salt );
      const doctor = await doctorModel.create({
        username,
        name,
        email,
        password :encryptedPassword,
        birthDate,
        hourlyRate,
        affiliation,
        educationalBackground,
        speciality,
      });
      await doctor.save();
      await userModel.create({
        username, 
        userId : doctor._id
      })
      res.status(200).json("Applied Successfully");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const editDoctor = async (req, res) => {
  let id = req.query.id;
  let { email, hourlyRate, affiliation } = req.body;
  try {
    let updatedDoctor = await doctorModel.findByIdAndUpdate(
      id,
      {
        email,
        hourlyRate,
        affiliation,
      },
      { new: true }
    );
    res.json("Details updated successfully");
  } catch (err) {
    res.send(err.message);
  }
};
const myPatients = async (req, res) => {
  try {
    let id = req.query.id;
    let AllmyAppointments = await appointmentModel
      .find({ doctor: new mongoose.Types.ObjectId(id) })
      .populate({ path: "patient" });
    let patients = AllmyAppointments.map((appointment) => appointment.patient);
    res.status(200).json(patients);
  } catch (err) {
    res.send(err.message);
  }
};
const viewPatient = async (req, res) => {
  try {
    let patientID =new mongoose.Types.ObjectId(req.query.id);
    const patient = await patientModel.findById(patientID);
    if (patient) {
      res.status(200).json(patient);
    } else {
      res.status(404).json("Patient not found !! ");
    }
  } catch (err) {
    res.json(err.message);
  }
};

  const exactPatients = async (req, res) => {
    try{
    let id=req.query.id;
    let name= req.query.name;
    let AllmyAppointments= await appointmentModel.find({ doctor:new mongoose.Types.ObjectId(id)}).populate({path:'patient'});
    let patients = AllmyAppointments.map(appointment => appointment.patient);
    let filteredPatients = patients.filter(patient => patient.name === name);
    res.status(200).json(filteredPatients);
    }
    catch(err){
      res.send(err.message);
    }
  };


const filterPatientsByAppointments = async (req, res) => {
  let doctorID = req.query.id;
  try {
    const appointments = await appointmentModel
      .find({ doctor: doctorID})
      .populate({path:"patient"}).exec();
    const patients = appointments
      .filter((appointment) => appointment.status !== "canceled")
      .map((appointment) => appointment.patient);
    res.json(patients);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  addDoctor,
  editDoctor,
  filterAppointmentsForDoctor,
  createAppointment,
  myPatients,
  filterPatientsByAppointments,
  viewPatient,
  createPrescription,
  exactPatients
};
