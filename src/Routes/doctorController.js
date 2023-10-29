const adminModel = require("../Models/Admin.js");
const doctorModel = require("../Models/Doctor.js");
const patientModel = require("../Models/Patient.js");
const { default: mongoose } = require("mongoose");

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
module.exports = { addDoctor };
