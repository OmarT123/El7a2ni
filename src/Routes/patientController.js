const familyModel = require("../Models/FamilyMember.js");
const patientModel = require("../Models/Patient.js");
const appointmentModel = require("../Models/Appointment.js");
const doctorModel = require("../Models/Doctor.js");
const medicineModel = require("../Models/Medicine.js")
const prescriptionModel = require("../Models/Prescription.js");
const healthPackageModel = require('../Models/HealthPackage.js')
const userModel = require("../Models/User.js")
const mongoose = require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const nodemailer = require('nodemailer');

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
    const user = await userModel.findOne({username})
    if (user)
    {
      res.status(409).json("Username already exists")
    }
    else {
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
      await userModel.create({
        username, 
        userId : patient._id
      })
      res.json("Created Successfully");
    }
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

const viewPatientAppointments = async (req, res) => {
  try {
    const patientID = req.query.id;
    const currentDate = new Date();

    const upcomingAppointments = await appointmentModel
      .find({
        patient: patientID,
        date: { $gte: currentDate },
      })
      .populate({ path: "doctor" });

    const pastAppointments = await appointmentModel
      .find({
        patient: patientID,
        date: { $lt: currentDate },
      })
      .populate({ path: "doctor" });

    const appointmentData = {
      upcomingAppointments,
      pastAppointments,
    };

    res.status(200).json(appointmentData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const payWithCard = async (req, res) => {
  const url = req.query.url
  const item = req.query.item;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name
          },
          unit_amount: item.price*100
        },
        quantity: 1
      }]
    ,
    success_url: `http://localhost:3000/${url}`,
    cancel_url:`http://localhost:3000/cancelCheckout`,
  })
  res.json({url: session.url})
}

const payWithWallet = async(req, res) => {
  const patientId = req.query.id
  const price = req.query.price
  const url = req.query.url
  try {
    const patient = await patientModel.findById(patientId)
    if (patient.wallet < price)
    {
      return res.json({success: false, message:"Insufficient funds!"})
    }
    const newWallet = patient.wallet - price
    const updatedPatient = await patientModel.findByIdAndUpdate(patient._id,{ wallet :newWallet})
    res.json({success:true, url: `/${url}`})
  }
  catch(err) {
    res.json(err.message)
  }
}

const buyHealthPackage = async (req, res) => {
  const patientId = req.query.id

  const healthPackageId = req.query.healthPackageId
  try {
    const curDate = new Date()
    curDate.setMonth(curDate.getMonth() + 1);
    const hPackage = {
      healthPackageID: healthPackageId,
      status: 'subscribed',
      endDate: curDate
    }
    const patient = await patientModel.findById(patientId)
    patient.healthPackage.push(hPackage)
    await patient.save()
    res.json("Updated Successfully")
  }
  catch(err) {
    res.json(err.message)
  }
}

const reserveAppointment = async(req, res) => {
  const patientId = req.query.id
  const appointmentId = req.query.appointmentId
  try {
    const appointment = await appointmentModel.findByIdAndUpdate(appointmentId, { patient: new mongoose.Types.ObjectId(patientId), status: "upcoming" })
    await appointment.save()
    res.json('updated Successfully')
  }catch (err) {
    res.json(err.message)
  }
}

const sendCheckoutMail = async (req, res) => {
  const patientId = req.query.id
  const patient = await patientModel.findById(patientId)
  const message = req.query.message

  const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: patient.email,
    subject: 'Payment Confirmation',
    text: message,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    res.json('done')
  } catch (error) {
    res.json('done')
  }
}

const getHealthPackageForPatient = async (req,res) => {
  try {
    const id = req.query.id
    const hpackage = await healthPackageModel.findById(id)
    res.json(hpackage)
  }catch(err)
  {res.json(err.message)}
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
  getDoctors,
  viewPatientAppointments,
  payWithCard,
  payWithWallet,
  buyHealthPackage,
  reserveAppointment,
  sendCheckoutMail,
  getHealthPackageForPatient
};
