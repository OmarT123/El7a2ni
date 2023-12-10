const familyModel = require("../Models/FamilyMember.js");
const patientModel = require("../Models/Patient.js");
const appointmentModel = require("../Models/Appointment.js");
const doctorModel = require("../Models/Doctor.js");
const medicineModel = require("../Models/Medicine.js")
const prescriptionModel = require("../Models/Prescription.js");
const userModel = require("../Models/User.js")
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');


const addPatient = async(req,res) => {

  const{username, name, email, password, birthDate, gender, mobileNumber,emergencyContact} = req.body;
  try{
    if (!username || !password || !name || !birthDate || !gender || !mobileNumber || !emergencyContact || !email) {
      return res.status(400).json({ success: false, message: "All fields are required. Please provide valid information for each field!" });
    }
    const user = await userModel.findOne({username})
  if (user)
  {
    res.json("Username already exists")
  }
  else{
    
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%^&*()?[\]{}|<>])[A-Za-z\d@$!%^&*()?[\]{}|<>]{10,}$/;
    if (!passwordRegex.test(password)) {
      return res.json({
        success: false,
        message: "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character, and be at least 10 characters long.",
      });
    }
    const salt = await bcrypt.genSalt();
    const encryptedPassword = await bcrypt.hash(password ,salt)
    const patient = await patientModel.create({username,name,email, password :encryptedPassword,birthDate, gender, mobileNumber,emergencyContact});
    await patient.save();

   const user = await userModel.create({
      username, 
      userId : patient._id,
      type : 'patient'
    })
    await user.save();

    res.json("Registered Successfully !!");
  }
  }catch(error){
      res.json({error:error.message})
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
      return res.status(404).send("No such patient found in the database.");
    await familyMember.save();
    patient.familyMembers.push(familyMember.id);
    await patient.save();
    res.json("Family Member added successfully");
  } catch (err) {
    res.json("Error in adding a family member!!");
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
    const dateParam = req.query.date
    const startDate = new Date(dateParam);
    const endDate = new Date(dateParam);
    endDate.setDate(endDate.getDate() + 1);
    baseQuery["createdAt"] = { $gte: startDate, $lt: endDate };
  }
  try {
    const prescriptions = await prescriptionModel.find(baseQuery).populate({path:"medicines.medId"});

    res.json(prescriptions);
  } catch (err) {
        res.status(404).send({ message: "No prescriptions found!" });
  }
}

const filterAppointmentsForPatient = async (req, res) => {
  // Need login
  const dateToBeFiltered = req.query.date;
  const statusToBeFiltered = req.query.status;
  const filterQuery = {};

  if (dateToBeFiltered) {
    const dateParam = dateToBeFiltered
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
    filterQuery["patient"] = new mongoose.Types.ObjectId(id);
    try {
      const filteredAppointments = await appointmentModel
        .find(filterQuery)
        .populate({ path: "doctor" });
      if (filteredAppointments.length === 0) {
        return res.json("No matching appointments found for the Patient." );
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
        return res.json("No matching appointments found for the Patient." );
      } 
      else{
        res.json(filteredAppointments);
      }     
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "No matching appointments found for the Patient." });
    }
  }
};
  
const selectDoctorFromFilterSearch = async (req, res) => {
  
  try {
    let doctorID = new mongoose.Types.ObjectId(req.query.id);
    const doctorList = await doctorModel.findById(doctorID);
    res.json(doctorList);
  } catch (error) {
    console.log(error.message)
    res.json(error.message);
  }
};
  
const getFamilyMembers = async (req, res) => {
  try {
    const patientId = req.query.id;
    const patient = await patientModel.findById(patientId).populate({path:"familyMembers"})
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
    //console.log(prescription)
    res.status(200).json(prescription);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const filterDoctorsSpecialityDate = async(req,res)=>{
  try{
    if (req.query.date) {
      const dateParam = req.query.date
      const startDate = new Date(dateParam);
      const endDate = new Date(dateParam);
      endDate.setDate(endDate.getDate() + 1);


      let busyDoctors = await appointmentModel.find({createdAt:{ $gte: startDate, $lt: endDate }}).populate({path:"doctor"});
      const busyDoctorsMapped = busyDoctors.map(appointment=>appointment.doctor);
      //console.log(busyDoctorsMapped);
      let query = {};
      if (req.query.speciality)
        query["speciality"]=req.query.speciality
      let doctors = await doctorModel.find(query);
      //console.log(doctors)
      let availableDoctors = [];
      for (let i = 0; i < doctors.length; i++){
        let found = false;
        for (let j = 0; j < busyDoctorsMapped.length;j++)
        {
          console.log(doctors[i].username)
          console.log(busyDoctorsMapped[j].username)
          if (doctors[i].username === busyDoctorsMapped[j].username)
          { 
            found = true;
          }
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
  addPatient,
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
