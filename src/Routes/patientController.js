const familyModel = require("../Models/FamilyMember.js");
const patientModel = require("../Models/Patient.js");
const appointmentModel = require("../Models/Appointment.js");
const doctorModel = require("../Models/Doctor.js");
const medicineModel = require("../Models/Medicine.js")
const prescriptionModel = require("../Models/Prescription.js");
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
    res.status(200).json("Created Successfully");
  } catch (error) {
    res.status(404).json({ error: error.message });
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
      return res.status(404).send("No such patient found in the database.");
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
  if (req.query.name) {
    baseQuery["name"] = new RegExp(req.query.name, "i");
  }
  if (req.query.speciality) {
    baseQuery["speciality"] = new RegExp(req.query.speciality, "i");
  }
  try {
    const doctors = await doctorModel.find(baseQuery);
    res.json(doctors);
  } catch (err) {
    res.status(404).send({ message: "No doctors found!" });
  }
};

const filterPrescriptionByDateDoctorStatus = async (req, res) => {
  const baseQuery = {};
  baseQuery["patient"] =  new mongoose.Types.ObjectId(req.query.id)
  if (req.query.doctor) {
    //baseQuery["doctor"] = new RegExp(req.body.doctor, "i");
    baseQuery["doctor"] = new mongoose.Types.ObjectId(req.query.doctor);
  }
  if (req.query.filled || req.query.filled == false) {
    //baseQuery["filled"] = new RegExp(req.body.filled, "i");
    baseQuery["filled"] = req.query.filled;
  }
  if (req.query.date) {
    //baseQuery["date"] = new RegExp(`^${req.body.date.replace(/\//, "\\/")}$`);
    baseQuery["createdAt"] = req.query.date;
  }
  try {
    const prescriptions = await prescriptionModel.find(baseQuery).populate({path:"medicines.medId"});
    // console.log(baseQuery)
    // console.log(prescriptions)
    // const filtered = prescriptions.filter(pres => toString(pres._id) === req.query.id)
    res.json(prescriptions);
  } catch (err) {
    //res.status(500).send({ message: "No prescriptions found!" });
    res.status(404).send({ message: "No prescriptions found!" });
  }
}

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
  if (req.query.id) {
    const id = req.query.id;
    filterQuery["patient"] = new mongoose.Types.ObjectId(id);
    try {
      console.log(id);
      const filteredAppointments = await appointmentModel
        .find(filterQuery)
        .populate({ path: "doctor" });
      if (filteredAppointments.length === 0) {
        return res.status(404).json({ error: "No matching appointments found for the patient." });
      }
      res.json(filteredAppointments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while retrieving appointments." });
    }
  } else {
    try {
      const filteredAppointments = await appointmentModel.find(filterQuery);
      res.json(filteredAppointments);
    } catch (err) {
      console.error(err);
      res.status(404).json({ error: "No matching appointments found for the patient." });
    }
  }}
  
const selectDoctorFromFilterSearch = async (req, res) => {
  let doctorID = new mongoose.Types.ObjectId(req.query.id);

  try {
    const doctorList = await doctorModel.findById(doctorID);
    res.json(doctorList);
  } catch (error) {
    res.json(err.message);
  }
};
  
const getFamilyMembers = async (req, res) => {
  try {
    const patientId = new mongoose.Types.ObjectId(req.query.id);
    const patientList = await patientModel
      .findById(patientId)
      .populate({ path: "familyMembers" });
    const familyMember = patient.familyMembers;
    res.json(familyMember);
  } catch (err) {
    res.json(err.message);
  }
};
  
 const viewMyPrescriptions = async (req, res) => {
  try {
    const patientId = req.query.id;
    const prescriptions = await prescriptionModel.find({ patient: new mongoose.Types.ObjectId(patientId) }).populate({path:'medicines.medId'}).populate({path :'doctor'}).exec();
    // console.log(prescriptions.doctor.name);

    res.json(prescriptions);
  }
  catch (err) {
    res.json(err.message);

  }
};
  
  const selectPrescription = async (req, res) => {
  try {
    const prescriptionId = req.query.id;
    const prescription = await prescriptionModel.findById(prescriptionId).populate({path :'medicines.medId'}).exec();
    console.log(prescription)
    res.status(200).json(prescription);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const filterDoctorsSpecialityDate = async(req,res)=>{
  try{
    if (req.query.date) {
      let busyDoctors = await appointmentModel.find({date:req.query.date});
      const busyDoctorsMapped = busyDoctors.map(appointment=>appointment.doctor);
      //console.log(busyDoctorsMapped);
      let query = {};
      if (req.query.speciality)
        query["speciality"]=req.query.speciality
      let doctors = await doctorModel.find(query);
      let availableDoctors = [];
      for (let i = 0; i < doctors.length; i++){
        let found = false;
        for (let j = 0; j < busyDoctorsMapped.length;j++)
        {
          if (toString(doctors[i]) === toString(busyDoctorsMapped[j]))
            found = true;
        }
        if (!found)
          availableDoctors.push(doctors[i])
      }
      res.send(availableDoctors)
    }else {let query = {};
    if (req.query.speciality)
      query["speciality"]=req.query.speciality
      let doctors = await doctorModel.find(query)
      res.send(doctors)
    }
  }catch(err)
  {
    res.send(err.message)
  }
}

const getDoctors = async (req, res) => {
  try{
    const doctors = await doctorModel.find({})
    const clinicMarkUp= 10;
    const patientId = req.query.id;
    const patient = await patientModel.findById(patientId).populate({path:"healthPackage"});
    const discount = 0
    let data=[]
    for (let index = 0; index < doctors.length; index++) {
        const element = doctors[index]._doc;
        const sessionPrice=(element.hourlyRate+10/100*clinicMarkUp-discount)
        data.push( {...element,sessionPrice:sessionPrice});
    }
    res.status(200).json(data)
  }

catch(error){
  res.status(400).json({error:error.message})
}
}

module.exports = {
  createFamilyMember,
  createPatient,
  searchForDoctorByNameSpeciality,
  filterAppointmentsForPatient,
  getFamilyMembers,
  filterPrescriptionByDateDoctorStatus,
  filterDoctorsSpecialityDate,
  selectDoctorFromFilterSearch,
  viewMyPrescriptions,
  selectPrescription,
  getDoctors
};
