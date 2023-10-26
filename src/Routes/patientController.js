const patientModel = require('../Models/Patient.js');
const { default: mongoose } = require('mongoose');

const createPatient = async(req,res) => {
    const{username,name, email,password,birthDate,gender,mobileNumber,emergencyContact} = req.body;
    try{
        const patient = await patientModel.create({username,name, email,password,birthDate,gender,mobileNumber,emergencyContact});
        res.status(200).json(patient);
    }catch(error){
        res.status(400).json({error:error.message})
    }
}
module.exports = {createPatient}; // to export it