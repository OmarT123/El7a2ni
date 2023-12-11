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


const filterAppointmentsForDoctor = async (req, res) => {
  // Need login
  const dateToBeFiltered = req.query.date;
  const statusToBeFiltered = req.query.status;
  const searchQuery = new RegExp(statusToBeFiltered, "i"); // 'i' flag makes it case-insensitive

  
  const filterQuery = {};

  if (dateToBeFiltered) {
    const dateParam = req.query.date
    const startDate = new Date(dateParam);
    const endDate = new Date(dateParam);
    endDate.setDate(endDate.getDate() + 1);
    filterQuery["date"] = { $gte: startDate, $lt: endDate };
  }

  if (searchQuery) {
    filterQuery["status"] = searchQuery;
  }
  if (req.user._id) {
    const id = req.user._id;
    filterQuery["doctor"] = id;
    try {
      const filteredAppointments = await appointmentModel
        .find(filterQuery)
        .populate({ path: "patient" });
      if (filteredAppointments.length === 0) {
        return res.json([]);
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
        return res.json([]);
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
    speciality,
    idPDF,
    degreePDF,
    licensePDF
  } = req.body;
  try {
    if (!username || !password || !name || !birthDate || !hourlyRate || !affiliation || !educationalBackground || !speciality || !email) {
      return res.json({ success: false, message: "All fields are required. Please provide valid information for each field!" });
    }


    const user = await userModel.findOne({username})
    if (user)
    {
      res.json("Username already exists")
    }
    else {
      
      
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%^&*()?[\]{}|<>])[A-Za-z\d@$!%^&*()?[\]{}|<>]{10,}$/;
    if (!passwordRegex.test(password)) {
      return res.json({
        success: false,
        message: "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character, and be at least 10 characters long.",
      });
    }
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
        idPDF,
        degreePDF,
        licensePDF
      });
      await doctor.save();
      const userC = await userModel.create({
        username, 
        userId : doctor._id,
        type :'doctor'
      })
      await userC.save();
      res.json("Applied Successfully");
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};

const editDoctor = async (req, res) => {
  let id = req.user._id;
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
    let id = req.user._id;
    let AllmyAppointments = await appointmentModel
      .find({ doctor: id })
      .populate({ path: "patient" });
    
    let patients = AllmyAppointments
    .map((appointment) => appointment.patient !== null ? appointment.patient : undefined)
    .filter(patient => patient !== undefined);
    
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
    let id=req.user._id;
    const { name } = req.query;
    // const searchQuery = new RegExp(name, "i"); // 'i' flag makes it case-insensitive

    let AllmyAppointments= await appointmentModel.find({ doctor:id}).populate({path:'patient'});
    let patients = AllmyAppointments.map(appointment => appointment.patient);
    let filteredPatients = patients.filter(patient => patient.name === name);
    res.status(200).json(filteredPatients);
    }
    catch(err){
      res.send(err.message);
    }
  };


const filterPatientsByAppointments = async (req, res) => {
  let doctorID = req.user._id;
  try {
    const appointments = await appointmentModel
      .find({ doctor: doctorID})
      .populate({path:"patient"}).exec();
    const patients = appointments
      .filter((appointment) => appointment.status !== "canceled" && appointment.patient !== null)
      .map((appointment) => appointment.patient);
    res.json(patients);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
const ViewDoctorWallet = async (req, res) => {
  try {
    const DoctorId = req.query.id;
    const Doctor = await doctorModel.findById(DoctorId).populate('wallet').exec();
   
    if (!Doctor) {
      console.log('Doctor not found');
      return;
    }
    const wallet = Doctor.wallet;
    res.json(wallet);
  }
  catch (err) {
    res.json(err.message);

  }
};

//new Req.45//
const viewDoctorAppointments = async (req, res) => {
  try {
    const doctorID = req.query.id;
    const currentDate = new Date();

    const upcomingAppointments = await appointmentModel
      .find({
        doctor: doctorID,
        date: { $gte: currentDate },
      })
      .populate({ path: "patient" });

    const pastAppointments = await appointmentModel
      .find({
        doctor: doctorID,
        date: { $lt: currentDate },
      })
      .populate({ path: "patient" });

    const appointmentData = {
      upcomingAppointments,
      pastAppointments,
    };

    res.status(200).json(appointmentData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addHealthRecord = async (req, res) =>{
  try{
  let id = req.body.id;
  let healthRecord = req.body.base64;

  const patient = await patientModel.findById(id);
  patient.HealthRecords.push(healthRecord);
  await patient.save();
  res.status(200).json({ message: 'Health record added successfully'});
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



const addAppointmentSlots = async (req,res) => {
  const doctorID = req.query.id;
  const doctor = await doctorModel.findById(doctorID);
  
  if(doctor.status === "approved")
  {
    const date = new Date(req.body.date);
    const minTime = new Date(date.getTime()- 60 * 60 * 1000)
    const maxTime = new Date(date.getTime() + 60 * 60 * 1000)
    const existingAppointment = await appointmentModel.findOne({
      doctor:doctor._id,
      date: { $gt: minTime, $lt: maxTime },
    });
    if (existingAppointment)
    {
      res.json("There is already an appointment at this time")
    }
    else {
      await appointmentModel.create({
        doctor: doctor._id,
        date,
        status: 'free'
      })
      res.send("Appointment created successfully")
    }
  }
  else
    res.status(400).json("Please review your employment contract.")

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

const acceptContract = async(req, res) => {
  try {
    let doctorId = req.user._id
    await doctorModel.findByIdAndUpdate(doctorId, {status: "accepted"})
    res.json('The contract has been accepted')
  }catch (err) {
    res.json(err.message)
  }
}

const rejectContract = async(req, res) => {
  try {
    let doctorId = req.user._id
    await doctorModel.findByIdAndUpdate(doctorId, {status: "rejected"})
    res.json('The contract has been rejected')
  }catch (err) {
    res.json(err.message)
  }
}



module.exports = {
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
  addHealthRecord,
  acceptContract,
  rejectContract
};
