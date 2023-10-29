const familyModel = require("../Models/FamilyMember.js");
const patientModel = require('../Models/Patient.js');
const appointmentModel = require('../Models/Appointment.js');

const mongoose = require("mongoose");

const createPatient = async(req,res) => {
    const{username,name, email,password,birthDate,gender,mobileNumber,emergencyContact} = req.body;
    try{
        const patient = await patientModel.create({username,name, email,password,birthDate,gender,mobileNumber,emergencyContact});
        res.status(200).json(patient);
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

const createFamilyMember = async (req, res) => {
  try {
    let patientId = req.query.id;
    let name = req.body.name;
    let nationalId = req.body.nationalId;
    let age = req.body.age;
    let gender = req.body.gender;
    let relationToPatient = req.body.relationToPatient;
    if (
      relationToPatient !== "wife" &&
      relationToPatient !== "husband" &&
      relationToPatient !== "son" &&
      relationToPatient !== "daughter"
    )
      throw "Relation to Patient should be wife/husband/son/daughter";
    let familyMember = await familyModel.create({
      name,
      nationalId,
      age,
      gender,
      relationToPatient,
      patient: patientId,
    });
    await familyMember.save();
    res.send(familyMember);
  } catch (err) {
    res.send(err);
  }
};

const filterAppointmentsForPatient = async (req, res) => {
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
    filterQuery["patient"] = new mongoose.Types.ObjectId(id) ;
    try {
      console.log(id)
      const filteredAppointments = await appointmentModel.find(filterQuery).populate({path:"doctor"});
      if (filteredAppointments.length === 0) {
        return res.status(404).json({ error: 'No matching appointments found for the patient.' });
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
      res.status(404).json({ error: 'No matching appointments found for the patient.' });
    }
  }

 
}


module.exports = { createFamilyMember, createPatient ,filterAppointmentsForPatient };
