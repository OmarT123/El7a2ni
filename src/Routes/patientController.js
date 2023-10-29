const familyModel = require("../Models/FamilyMember.js");
const patientModel = require("../Models/Patient.js");
const mongoose = require("mongoose");
const doctorModel = require("../Models/Doctor.js");
const healthPackageModel = require("../Models/HealthPackage.js");
const FamilyMember = require("../Models/FamilyMember.js");

const createPatient = async(req,res) => {
    const{username,name, email,password,birthDate,gender,mobileNumber,emergencyContact,healthPackageId} = req.body;
    try{
        const patient = await patientModel.create({username,name, email,password,birthDate,gender,mobileNumber,emergencyContact,healthPackageId});
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
    ) {
      throw "Relation to Patient should be wife/husband/son/daughter";
    }
    let familyMember = await familyModel.create({
      name,
      nationalId,
      age,
      gender,
      relationToPatient,
    });
    const patient = await patientModel.findById(patientId);
    if (!patient)
      return res.status(403).send("No such patient found in the database.");
    await familyMember.save();
    patient.familyMembers.push(familyMember.id);
    await patient.save();
    res.send(familyMember);
  } catch (err) {
    res.send(err);
  }
};



const getDoctors = async (req, res) => {
  try{
    const doctors = await doctorModel.find({})
    const clinicMarkUp= 10;
    const patientId = req.body.patientId; 
    const patient = await patientModel.findById(patientId);
   // console.log( patient.healthPackageId);
    const packageID= patient.healthPackageId;
    const package= await healthPackageModel.findById(packageID);
    const discount= package.doctorDiscount;
    let data=[]
    for (let index = 0; index < doctors.length; index++) {
        const element = doctors[index];
        const sessionPrice=(element.hourlyRate+10/100*clinicMarkUp-discount)
        const speciality=element.speciality
        data.push( {speciality:element.speciality,sessionPrice:sessionPrice,name:element.name});
       
    }
    res.status(200).json(data)
  
  }

catch(error){
  res.status(400).json({error:error.message})
}
}
 
  const getADoctor = async (req, res) => {
    try{
  const doctorId=req.body.doctorId
  const doctor= await doctorModel.findById(doctorId);
  const data={name:doctor.name,username:doctor.username,birthDate:doctor.birthDate,hourlyRate:doctor.hourlyRate,email:doctor.email,speciality:doctor.speciality,affiliation:doctor.affiliation,educationalBackground:doctor.educationalBackground,pendingApproval:doctor.pendingApproval}
    res.status(200).json(data)
  }

catch(error){
  res.status(400).json({error:error.message})
}
  }
  module.exports = { createFamilyMember, createPatient ,getDoctors,getADoctor};