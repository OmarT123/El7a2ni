const familyModel = require("../Models/FamilyMember.js");
const patientModel = require("../Models/Patient.js");
const doctorModel = require("../Models/Doctor.js");
const mongoose = require("mongoose");

const createPatient = async (req, res) => {
  const {
    username,
    name,
    email,
    password,
    birthDate,
    gender,
    mobileNumber,
    emergencyContact,
  } = req.body;
  try {
    const patient = await patientModel.create({
      username,
      name,
      email,
      password,
      birthDate,
      gender,
      mobileNumber,
      emergencyContact,
    });
    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
const searchForDoctorByNameSpeciality = async (req, res) => {
  const baseQuery = {};
  if (req.body.name) {
    baseQuery["name"] = new RegExp(req.body.name, "i");
  }
  if (req.body.speciality) {
    baseQuery["speciality"] = new RegExp(req.body.speciality, "i");
  }
  console.log({ name: baseQuery.name });
  try {
    const doctors = await doctorModel.find(baseQuery);
    res.json(doctors);
  } catch (err) {
    res.status(500).send({ message: "No doctors found!" });
  }
};

module.exports = {
  createFamilyMember,
  createPatient,
  searchForDoctorByNameSpeciality,
};
