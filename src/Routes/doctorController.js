const adminModel = require('../Models/Admin.js');
const doctorModel = require('../Models/Doctor.js');
const patientModel = require('../Models/Patient.js');
const appointmentModel = require('../Models/Appointment.js');
const { default: mongoose } = require('mongoose');

const addDoctor = async(req,res) =>{
    const{username, name, email, password, birthDate , hourlyRate, affiliation, educationalBackground} = req.body;
    try{
        const doctor = await doctorModel.create({username, name, email, password,  birthDate, hourlyRate, affiliation,educationalBackground});
        res.status(200).json(doctor)
    }catch(error){
        res.status(400).json({error:error.message})
    }

}
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
    
module.exports = {addDoctor,editDoctor,myPatients};
