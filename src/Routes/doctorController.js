const doctorModel = require('../Models/Doctor.js');
const patientModel = require('../Models/Patient.js');
const appointmentModel = require('../Models/Appointment.js');
const adminModel = require("../Models/Admin.js");
const { default: mongoose } = require("mongoose");


const createAppointment = async(req,res) => {
    try {
        let appointment = await appointmentModel.create({patient:req.body.patient,doctor:req.body.doctor,date:req.body.date,status:req.body.status})
        await appointment.save()
        res.send(appointment);
    }catch(err) {
        res.send(err.message);
    }
}

const filterAppointmentsForDoctor = async (req, res) => {
    // Need login
    const dateToBeFiltered = req.body.date;
    const statusToBeFiltered = req.body.status;
    const filterQuery = {};
  
    if (dateToBeFiltered) {
      filterQuery["date"] = dateToBeFiltered;
    }
  
    if (statusToBeFiltered) {
      filterQuery["status"] = statusToBeFiltered;
    }
    if(req.query.id){
      const id = req.query.id
      filterQuery["doctor"] = new mongoose.Types.ObjectId(id) ;
      try {
        const filteredAppointments = await appointmentModel.find(filterQuery).populate({path:"patient"});
        if (filteredAppointments.length === 0) {
          return res.status(404).json({ error: 'No matching appointments found for the Doctor.' });
        }
        res.json(filteredAppointments);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving appointments.' });
      }
    }else{
      try{
      const filteredAppointments = await appointmentModel.find(filterQuery);
      res.json(filteredAppointments);
      }
      catch(err){
        console.error(err);
        res.status(404).json({ error: 'No matching appointments found for the Doctor.' });
      }
    }
  
   
  }
  

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
  } = req.body;
  try {
    const doctor = await doctorModel.create({
      username,
      name,
      email,
      password,
      birthDate,
      hourlyRate,
      affiliation,
      educationalBackground,
      speciality,
    });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const editDoctor = async (req, res) => {
    let id = req.query.id;
    let { email, hourlyRate,affiliation } = req.body;
    try {
      let updatedDoctor = await doctorModel.findByIdAndUpdate(
        id,
        {
          email,
          hourlyRate,
          affiliation
        },
        { new: true }
      );
      res.send(updatedDoctor);
    } catch (err) {
      res.send(err.message);
    }
  };
  const myPatients = async (req, res) => {
    try{
    let id = req.query.id;
    let AllmyAppointments= await appointmentModel.find({ doctor:new mongoose.Types.ObjectId(id)}).populate({path:'patient'});
    let patients = AllmyAppointments.map(appointment => appointment.patient);
    let Patientinfo = patients.map(patient => ({
      name: patient.name, 
      birthDate: patient.birthDate ,
      records:patient.HealthRecords
    }));
    res.status(200).json(Patientinfo);
    }
    catch(err){
      res.send(err.message);
    }
  };

const filterPatientsByAppointments = async (req, res) => {
  let doctorID = new mongoose.Types.ObjectId(req.query.id);
  try {
    const appointments = await appointmentModel
      .find({ doctor: doctorID, date: { $gte: new Date() } })
      .populate("patient");
    const patients = appointments
      .filter((appointment) => appointment.status !== "canceled")
      .map((appointment) => appointment.patient);
    res.json(patients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
    
module.exports = { addDoctor,editDoctor,filterAppointmentsForDoctor, createAppointment,myPatients ,filterPatientsByAppointments};

