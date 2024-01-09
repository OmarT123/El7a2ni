const familyModel = require("../Models/FamilyMember.js");
const patientModel = require("../Models/Patient.js");
const appointmentModel = require("../Models/Appointment.js");
const doctorModel = require("../Models/Doctor.js");
const medicineModel = require("../Models/Medicine.js")
const prescriptionModel = require("../Models/Prescription.js");
const healthPackageModel = require("../Models/HealthPackage.js");
const userModel = require("../Models/User.js")
const orderModel = require('../Models/Order.js')
const adminModel = require('../Models/Admin');
const healthRecordsModel = require('../Models/HealthRecords.js');
const mongoose = require("mongoose");
const notificationSystemModel=require ('../Models/NotificationSystem.js') 
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const VideoChatRoom = require("../Models/VideoChatRoom.js");
require("dotenv").config();


const addPatient = async (req, res) => {
  const { username, name, email, password, birthDate, gender, mobileNumber, emergencyContact, nationalId } = req.body;
  try {
    if (!username || !password || !name || !birthDate || !gender || !mobileNumber || !emergencyContact || !email || !nationalId) {
      return res.json({ success: false, message: "All fields are required. Please provide valid information for each field!" });
    }
    const user = await userModel.findOne({ username })
    if (user) {
      res.json("Username already exists")
    }
    else {

      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%^&*()?[\]{}|<>])[A-Za-z\d@$!%^&*()?[\]{}|<>]{10,}$/;
      if (!passwordRegex.test(password)) {
        return res.json({
          success: false,
          message: "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character, and be at least 10 characters long.",
        });
      }

      const salt = await bcrypt.genSalt();
      const encryptedPassword = await bcrypt.hash(password, salt)
      const patient = await patientModel.create({ username, name, email, password: encryptedPassword, birthDate, gender, mobileNumber, emergencyContact, cart: { items: [], amountToBePaid: 0 }, nationalId });
      await patient.save();

      const user = await userModel.create({
        username,
        userId: patient._id,
        type: "patient"
      })
      await user.save();

      res.json("Registered Successfully !!");
    }
  } catch (error) {
    res.json({ error: error.message })
  }
}

const filterByMedicinalUsePatient = async (req, res) => {
  const searchName = req.query.medicinalUse;
  if (searchName.length < 3) {
    return res.json('Search query must be at least three characters');
  }
  const medUse = new RegExp(searchName, "i")

  try {
    const results= await medicineModel.find({medicinalUse:medUse})
    if(results.length == 0){
      res.json("Medicine is not Found !!" );
    }
    else {
      res.json(results);
    }
  }
  catch (err) {
    res.json({ message: err.message })
  }

}


const searchMedicinePatient = async (req, res) => {
  const searchName = req.query.name;
  if (searchName.length < 3) {
    return res.json('Search query must be at least three characters');
  }
  const searchQuery = new RegExp(searchName, 'i'); // 'i' flag makes it case-insensitive

  try {
    const results = await medicineModel.find({ name: searchQuery, stockQuantity: { $gt: 0 } });
   
    if (results.length === 0) {
      return res.json("Medicine is not Found !!");
    } 
    else {
      return res.json(results);
    }
  } catch (error) {
    res.json(error.message);
  }
};



const viewMyCart = async (req, res) => {
  try {
    const patientId = req.user._id;
    const patient = await patientModel.findById(patientId)
      .populate({
        path: 'cart.items.medicine',
        model: 'Medicine'
      });
    if (!patient) {
      return res.json({ message: "Patient not found" });
    }

    const cart = patient.cart;

    res.json({ cart: cart, wallet: patient.wallet });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const cartvalue = async (patientId) => {
  try {
    const patient = await patientModel.findById(patientId)
      .populate({
        path: 'cart.items.medicine',
        model: 'Medicine'
      });

    if (!patient) {
      throw new Error("Patient not found");
    }

    const cart = patient.cart;
    return cart;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateSocketId = async(req,res)=>{
  const { socketId } = req.body;
    const userId  = req.user._id;
  try{
    const user = await userModel.findOne({userId:userId});
    if (!user) {
      // User with the specified ID not found
      // return res.send({ success: false, message: 'User not found' });
    }


    if(user.type ==='patient'){
      // console.log("patient id ")
      const patient = await patientModel.findByIdAndUpdate(userId,{socketId : socketId})
 

      await patient.save();
      res.send({ success: true, message: 'Socket ID updated for patient' });  
    }
    else if (user.type ==='doctor'){
      const doctor = await doctorModel.findByIdAndUpdate(userId,{socketId : socketId})
      await doctor.save();
      res.send({ success: true, message: 'Socket ID updated for doctor' }); 
    }
 }
  catch(err){
    res.json(err);
  }
 
}
const getSocketId = async(req,res)=>{
  const userId  = req.query.userId;
  console.log("user id to be called "+userId)
  let userIdConverted = new mongoose.Types.ObjectId(req.query.userId);
  try{
      const user = await userModel.findOne({userId:userIdConverted});
      if (!user) {
        console.log("no user")
      }
  
      console.log(user.type);
  
      if(user.type ==='patient'){
        const patient = await patientModel.findById(userIdConverted)
        console.log("socekt id for patient :"+patient.socketId)
        res.json(patient.socketId);  

      }
      else if (user.type ==='doctor'){
        console.log("d5lt fe user type doctor")
        const doctor = await doctorModel.findById(userIdConverted)
        console.log("socekt id for doctor :"+doctor.socketId)
        res.json(doctor.socketId);  
      }

  }
  catch(err){
    res.json(err);
  }
 
}

const handleAfterBuy = async (cart, id) => {
  try {
    for (const item of cart.items) {
      const medicineId = item.medicine;
      const quantityBought = item.quantity;
      const medicine = await medicineModel.findById(medicineId);
      medicine.amountSold += quantityBought;
      medicine.stockQuantity -= quantityBought;
      if (medicine.stockQuantity <= 0) {
        const expiryTime = new Date(); 
        const purchaseTime =new Date(); 
        expiryTime.setFullYear(expiryTime.getFullYear() + 1); 
        const pharmacists = await pharmacistModel.find();
        for (const pharmacist of pharmacists) {
          addNotification('Pharmacist',pharmacist._id,`Medicine "${medicine.name}" is out of stock. Please restock.`,expiryTime,purchaseTime)
        }
      await medicine.save();
    }
  }
    const patient = await patientModel.findById(id);
    patient.cart.items = [];
    patient.cart.amountToBePaid = 0;
    await patient.save();

  } catch (error) {
    console.error('Error updating medicine quantities:', error.message);
    throw error;
  }
};

const handleAfterCancel = async (items) => {
  try {
    for (const item of items) {
      const medicineId = item.medicine;
      const quantityBought = item.quantity;
      const medicine = await medicineModel.findById(medicineId);
      medicine.amountSold -= quantityBought;
      medicine.stockQuantity += quantityBought;
      await medicine.save();
    }

  } catch (error) {
    console.error('Error updating medicine quantities:', error.message);
    throw error;
  }
};


const cancelOrder = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const patientId = req.user._id;
    const order = await orderModel.findById(orderId);
    const patient = await patientModel.findById(patientId);
    if (order.paymentMethod !== "cash On Delivery") {
      patient.wallet += order.total;
    }
    order.status = "Cancelled"
    await order.save();
    await patient.save();
    handleAfterCancel(order.items);
    res.status(200).json({
      message: 'order cancelled successfully',
      order: order,
    });
  }
  catch (error) {
    res.json({ error: error.message });
  }
};



const addToCart = async (req, res) => {
  const stringMedicineId = req.body.medicineId
  const medicineId = new mongoose.Types.ObjectId(stringMedicineId);
  const quantity = req.body.quantity;

  try {


    const medicine = await medicineModel.findById(stringMedicineId);
    const patientId = req.user._id; // Replace with your method of obtaining the patient's ID
    let oldcart = await cartvalue(patientId);
    if (!medicine) {
      return res.json({ message: "Medicine not found" });
    }

    if (quantity > medicine.stockQuantity) {
      return res.json({ message: "Requested quantity exceeds available stock", cart: oldcart });

    }

    const patient = await patientModel.findById(patientId);
    if (!patient) {
      return res.json({ message: "Patient not found" });
    }


 if(quantity>0){
    const existingCartItemIndex = patient.cart.items.findIndex(item => item.medicine.toString() === medicineId.toString());
    if (existingCartItemIndex !== -1) {
      if (patient.cart.items[existingCartItemIndex].quantity + quantity > medicine.stockQuantity)
        return res.json({ message: "Requested quantity exceeds available stock", cart: oldcart });
      else
        patient.cart.items[existingCartItemIndex].quantity += quantity;
    } else {

      patient.cart.items.push({ medicine: medicineId, quantity });
    }

    let price = medicine.price;
    let package_Id = null
    if (patient.healthPackage) {
      package_Id = patient.healthPackage.healthPackageID;
    }


    if (!package_Id)
      patient.cart.amountToBePaid += price * quantity;
    else {
      let package = await healthPackageModel.findById(package_Id)
      let ratio = package.medicineDiscount;
      let percentage = 1 - ratio / 100;
      patient.cart.amountToBePaid += (((price) * quantity) * percentage);
    }


    await patient.save();
    let modifiedcart = await cartvalue(patientId);

    res.json({
      message: 'Medicine added to cart successfully',
      cart: modifiedcart
    });
  }
  } catch (error) {
    res.json({ error: error.message });
  }
};


const removeFromCart = async (req, res) => {
  const stringMedicineId = req.body.medicineId;
  const medicineId = new mongoose.Types.ObjectId(stringMedicineId);

  try {
    const patientId = req.user._id; // Replace with your method of obtaining the patient's ID
    const patient = await patientModel.findById(patientId);
    let oldcart = await cartvalue(patientId);
    const medicine = await medicineModel.findById(stringMedicineId);
    const removedItem = patient.cart.items.find(item => item.medicine.toString() === medicineId.toString());
    const quantity = removedItem.quantity;

    let price = medicine.price;
    let package_Id = null
    if (patient.healthPackage) {
      package_Id = patient.healthPackage.healthPackageID;
    }

    if (!package_Id) {
      patient.cart.amountToBePaid -= price * quantity;
    } else {
      let package = await healthPackageModel.findById(package_Id)
      let ratio = package.medicineDiscount;
      let percentage = 1 - ratio / 100;
      patient.cart.amountToBePaid -= (price * quantity) * percentage;
    }
    patient.cart.items = patient.cart.items.filter(item => item.medicine.toString() !== medicineId.toString());
    await patient.save();
    let modifiedcart = await cartvalue(patientId);
    res.status(200).json({ message: `Medicine removed from cart successfully`, cart: modifiedcart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addNotification = async (type, Id, message, showtime, expiryTime) => {

  let user;

  switch (type) {
    case 'Pharmacist':
      user = await pharmacistModel.findById(Id);
      break;
    case 'Doctor':
      user = await doctorModel.findById(Id);
      break;
    case 'Patient':
      user = await patientModel.findById(Id);
      break;
    default:
      throw new Error('Invalid user type');
  }

  if (!user) {
    throw new Error(`No ${type} found with provided ID`);
  }

  // Create the notification
  const notification = await notificationSystemModel.create({
    type,
    Id,
    message,
    expiryTime,
    showtime
  });
  await notification.save();
}; 

const getMedicines = async (req, res) => {

try {

  const results = await medicineModel.find({ archived: false });
  res.json(results);
  }
  catch (error) {
  res.status(500).json(error.message);
}
}

const getSubMedicines = async (req, res) => {
const activeIngredient = req.query.activeIngredient;

try {
  const results = await medicineModel.find({ activeIngredient, stockQuantity: { $gt: 0 } });
  if (results.length === 0) {
    res.json({ medicines: results, message: "There is no substitute!" });
  } else {
    res.json({ medicines: results, message: "Done" });
  }
  console.log(results)
} catch (error) {
  res.status(500).json(error.message);
}
};



const increaseByOne = async (req, res) => {
  const stringMedicineId = req.body.medicineId;
  const medicineId = new mongoose.Types.ObjectId(stringMedicineId);
  const patientId = req.user._id; // Replace with your method of obtaining the patient's ID
  try {
    const medicine = await medicineModel.findById(stringMedicineId);
    const patient = await patientModel.findById(patientId);
    let oldcart = await cartvalue(patientId);
    const existingCartItemIndex = patient.cart.items.findIndex(item => item.medicine.toString() === medicineId.toString());
    if (patient.cart.items[existingCartItemIndex].quantity + 1 > medicine.stockQuantity) {
      res.status(200).json({ message: "Requested quantity exceeds available stock", cart: oldcart });
      return;
    } else {
      patient.cart.items[existingCartItemIndex].quantity += 1;
    }

    let price = medicine.price;
    let package_Id = null
    if (patient.healthPackage) {
      package_Id = patient.healthPackage.healthPackageID;
    }


    if (!package_Id) {
      patient.cart.amountToBePaid += price;
    } else {
      let package = await healthPackageModel.findById(package_Id)
      let ratio = package.medicineDiscount;
      let percentage = 1 - ratio / 100;
      patient.cart.amountToBePaid += (price * percentage);
    }

    await patient.save();
    let modifiedcart = await cartvalue(patientId);
    res.status(200).json({ message: `Medicine increased successfully`, cart: modifiedcart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const decreaseByOne = async (req, res) => {
  const stringMedicineId = req.body.medicineId;
  const medicineId = new mongoose.Types.ObjectId(stringMedicineId);
  try {
    const medicine = await medicineModel.findById(stringMedicineId);
    const patientId = req.user._id; // Replace with your method of obtaining the patient's ID
    const patient = await patientModel.findById(patientId);
    let message = "";
    const existingCartItemIndex = patient.cart.items.findIndex(item => item.medicine.toString() === medicineId.toString());

    if (patient.cart.items[existingCartItemIndex].quantity == 1) {
      patient.cart.items = patient.cart.items.filter(item => item.medicine.toString() !== medicineId.toString());
      await patient.save();
      msg = `Medicine removed from cart successfully`;
    }
    else {
      patient.cart.items[existingCartItemIndex].quantity -= 1;
      msg = `Medicine decreased successfully`;
    }
    let price = medicine.price;
    let package_Id = null
    if (patient.healthPackage) {
      package_Id = patient.healthPackage.healthPackageID;
    }
    if (!package_Id) {
      patient.cart.amountToBePaid -= price;
    } else {
      let package = await healthPackageModel.findById(package_Id)
      let ratio = package.medicineDiscount;
      let percentage = 1 - ratio / 100;
      patient.cart.amountToBePaid -= price * percentage;
    }

    await patient.save();
    let modifiedcart = await cartvalue(patientId);

    res.status(200).json({ message: msg, cart: modifiedcart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};







const createFamilyMember = async (req, res) => {
  try {
    let patientId = req.user._id;
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
      return res.send("No such patient found in the database.");
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
  baseQuery["patient"] = req.user._id;

  if (req.query.doctor) {
    const searchName = req.query.doctor;
    const searchQuery = new RegExp(searchName, "i");

    try {
      const doctors = await doctorModel.find({ name: searchQuery });

      if (!doctors || doctors.length === 0) {
        return res.json("Doctor is not Found!!");
      }

      const doctorIds = doctors.map(doctor => doctor._id);
      baseQuery["doctor"] = { $in: doctorIds };

    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  if (req.query.filled || req.query.filled === false) {
    baseQuery["filled"] = req.query.filled;
  }

  if (req.query.date) {
    const dateParam = req.query.date;
    const startDate = new Date(dateParam);
    const endDate = new Date(dateParam);
    endDate.setDate(endDate.getDate() + 1);
    baseQuery["createdAt"] = { $gte: startDate, $lt: endDate };
  }

  try {
    const prescriptions = await prescriptionModel
      .find(baseQuery)
      .populate({ path: "medicines.medId" })
      .exec();

    if (prescriptions.length === 0) {
      return res.json("No prescriptions found!");
    }
    let extendedPrescriptions = [];
    for (prescription of prescriptions) {
      let doctorr = await doctorModel.findOne(prescription.doctor._id)
      const extendedPrescription = {
        ...prescription.toObject(),
        doctor: doctorr.name,
      }
      extendedPrescriptions.push(extendedPrescription);
      console.log(extendedPrescription);
    }
    return res.json(extendedPrescriptions);
  } catch (err) {
    return res.json("Internal Server Error");
  }
};


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
  if (req.user._id) {
    const id = req.user._id;
    filterQuery["patient"] = new mongoose.Types.ObjectId(id);
    try {
      const filteredAppointments = await appointmentModel
        .find(filterQuery)
        .populate({ path: "doctor" });
      if (filteredAppointments.length === 0) {
        return res.json("No matching appointments found for the Patient.");
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
        return res.json("No matching appointments found for the Patient.");
      }
      else {
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
    const patientId = req.user._id;
    const patient = await patientModel.findById(patientId).populate({ path: "familyMembers" })
    const familyMember = patient.familyMembers;
    res.json(familyMember);
  } catch (err) {
    res.json(err.message);
  }
};

const viewMyPrescriptions = async (req, res) => {
  try {
    const patientId = req.user._id;
    const prescriptions = await prescriptionModel.find({ patient: patientId }).populate({ path: 'medicines.medId' }).populate({ path: 'doctor' }).exec();
    res.json(prescriptions);
  }
  catch (err) {
    res.json(err.message);
  }
};

const selectPrescription = async (req, res) => {
  try {
    const prescriptionId = req.query.id;
    const prescription = await prescriptionModel.findById(prescriptionId).populate({ path: 'medicines.medId' }).exec();
    res.status(200).json(prescription);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const filterDoctorsSpecialityDate = async (req, res) => {
  try {
    if (req.query.date) {
      const dateParam = req.query.date
      const startDate = new Date(dateParam);
      const endDate = new Date(dateParam);
      endDate.setDate(endDate.getDate() + 1);


      let busyDoctors = await appointmentModel.find({ createdAt: { $gte: startDate, $lt: endDate } }).populate({ path: "doctor" });
      const busyDoctorsMapped = busyDoctors.map(appointment => appointment.doctor);
      let query = {};
      if (req.query.speciality)
        query["speciality"] = req.query.speciality
      let doctors = await doctorModel.find(query);
      let availableDoctors = [];
      for (let i = 0; i < doctors.length; i++) {
        let found = false;
        for (let j = 0; j < busyDoctorsMapped.length; j++) {
          // console.log(doctors[i].username)
          // console.log(busyDoctorsMapped[j].username)
          if (doctors[i].username === busyDoctorsMapped[j].username) {
            found = true;
          }
        }
        if (!found)
          availableDoctors.push(doctors[i])
      }
      res.send(availableDoctors)
    } else {
      let query = {};
      if (req.query.speciality)
        query["speciality"] = req.query.speciality
      let doctors = await doctorModel.find(query)
      res.send(doctors)
    }
  } catch (err) {
    res.send(err.message)
  }
}




const viewMySubscribedHealthPackage = async (req, res) => {
  try {
    const patientId = req.user._id;
    const patient = await patientModel.findById(patientId).populate('healthPackage').exec();

    if (!patient) {
      console.log('Patient not found');
      return;
    }

    const extendedHealthPackages = [];

    const healthPackagePatient = patient.healthPackage;
    if (healthPackagePatient == undefined)
      return res.json([]);
    else {
      const status = healthPackagePatient.status;
      const endDate = healthPackagePatient.endDate;
      const healthPackage = await healthPackageModel.findById(healthPackagePatient.healthPackageID);
      const extendedHealthPackage = {
        ...healthPackage.toObject(),        // Spread properties from healthPackage
        status: status,
        endDate: endDate,
        patientName: patient.name,
      };
      extendedHealthPackages.push(extendedHealthPackage);
    }

    // Process family members' health packages
    for (const familyMemberId of patient.familyMembers) {
      const familyMember = await familyModel.findById(familyMemberId).populate('healthPackage').exec();

      if (familyMember) {
        const healthPackageFamilyMember = familyMember.healthPackage;
        if (healthPackageFamilyMember != undefined) {
          const status = healthPackageFamilyMember.status;
          const endDate = healthPackageFamilyMember.endDate;
          const healthPackage = await healthPackageModel.findById(healthPackageFamilyMember.healthPackageID);
          const extendedHealthPackage = {
            ...healthPackage.toObject(),
            patientName: familyMember.name,
            status: status,
            endDate: endDate,
          };
          extendedHealthPackages.push(extendedHealthPackage);
        }
      }
    }

    res.json(extendedHealthPackages);
  }
  catch (err) {
    res.json(err.message);

  }
};


const CancelSubscription = async (req, res) => {

  try {
    const patientId = req.user._id;
    const patient = await patientModel.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    patient.healthPackage.status = "cancelled";
    await patient.save();

    res.json({ message: 'Subscription canceled successfully' });
  } catch (error) {
    console.error('Error canceling subscription:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const ViewMyWallet = async (req, res) => {
  try {
    const patientId = req.user._id;
    const patient = await patientModel.findById(patientId).populate('wallet').exec();

    if (!patient) {
      console.log('Patient not found');
      return;
    }
    const wallet = patient.wallet;
    res.json(wallet);
  }
  catch (err) {
    res.json(err.message);

  }
};


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
  const patientId = req.user._id;
  const patient = await patientModel.findById(patientId)
  const url = req.query.url
  const item = req.query.item;
  const type = req.query.type
  const price = item.price
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100
      },
      quantity: 1
    }]
    ,
    success_url: `http://localhost:3000/${url}`,
    cancel_url: `http://localhost:3000/cancelCheckout`,
  })
  res.json({ url: session.url })
}

const payWithWallet = async (req, res) => {
  const patientId = req.user._id
  const price = req.query.price
  const url = req.query.url
  const type = req.query.type
  try {
    const patient = await patientModel.findById(patientId)

    console.log('--------')
    // if (patient.healthPackage && type === 'appointment')
    // {
    //   const healthPackageId = patient.healthPackage.healthPackageID
    //   console.log(healthPackageId)
    //   const healthPackage = await healthPackageModel.findById(healthPackageId)
    //   price *= (1 - (healthPackage.doctorDiscount)/100)
    // }
    if (patient.wallet < price) {
      return res.json({ success: false, message: "Insufficient funds!" })
    }
    const newWallet = patient.wallet - price
    const updatedPatient = await patientModel.findByIdAndUpdate(patient._id, { wallet: newWallet })
    res.json({ success: true, url: `/${url}` })
  }
  catch (err) {
    res.json(err.message)
  }
}

const createOrder = async (firstName, lastName, patientId, address, items, total, method) => {
  const order = await orderModel.create({
    patient: patientId,
    address: address,
    items: items,
    total: total,
    paymentMethod: method,
    status: "Preparing",
    First_Name: firstName,
    Last_Name: lastName
  })
  await order.save()
}


const pastOrders = async (req, res) => {
  try {
    const patientId = req.user._id;

    const orders = await orderModel.find({ patient: patientId, status: { $ne: 'Cancelled' } })
      .populate({
        path: 'items.medicine',
        model: 'Medicine'
      });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const cashOnDelivery = async (req, res) => {
  const id = req.user._id;
  const patient = await patientModel.findById(id)
  const items = patient.cart.items
  const address = req.query.address
  const firstName = req.query.firstName
  const lastName = req.query.lastName
  if (address && !patient.deliveryAddress.includes(address)) {
    patient.deliveryAddress.push(address)
    await patient.save();
  }
  createOrder(firstName, lastName, id, address, items, patient.cart.amountToBePaid, "cash On Delivery")
  handleAfterBuy(patient.cart, id)
  res.json({ success: true, url: '/SuccessfulCheckout' })
}


const buyHealthPackage = async (req, res) => {
  const patientId = req.user._id;
  const name = req.body.name
  const healthPackageId = req.body.healthPackageId
  try {
    const curDate = new Date()
    curDate.setMonth(curDate.getMonth() + 1);
    const healthPackage = await healthPackageModel.findById(healthPackageId)
    const hPackage = {
      healthPackageID: healthPackageId,
      status: 'subscribed',
      endDate: curDate
    }
    const patient = await patientModel.findById(patientId)
    if (name === patient.name) {
      patient['healthPackage'] = hPackage
      patient.familyMembers.map((fm) => {
        const update = async (fm) => {
          await familyModel.findByIdAndUpdate(fm.toString(),
            { healthPackageDiscount: { healthPackageID: healthPackageId, discount: healthPackage.familyDiscount } })
        }
        update(fm)
      })
      await patient.save()
    }
    else {
      patient.familyMembers.map(fm => {
        const check = async (fm) => {
          const familyMember = await familyModel.findById(fm)
          if (familyMember.name === name) {
            familyMember['healthPackage'] = hPackage
            await familyMember.save()
          }
        }
        check(fm)
      })
    }
    res.json("Updated Successfully")
  }
  catch (err) {
    res.json(err.message)
  }
}

const reserveAppointment = async (req, res) => {
  const patientId = req.user._id
  const appointmentId = req.body.appointmentId
  const name = req.body.name
  console.log(name)
  try {
    const appointment = await appointmentModel.findByIdAndUpdate(appointmentId, { patient: new mongoose.Types.ObjectId(patientId), status: "upcoming", attendantName: name }, { new: true })
    res.json('updated Successfully')
  } catch (err) {
    res.json(err.message)
  }
}

const sendCheckoutMail = async (req, res) => {
  const patientId = req.user._id;
  const patient = await patientModel.findById(patientId)
  const message = req.query.message
  const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
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
    res.json({ message: "done" })
  }
  catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
}


const getAllAddresses = async (req, res) => {
  const id = req.user._id;
  const patient = await patientModel.findById(id)
  res.json(patient.deliveryAddress)
}

const getHealthPackageForPatient = async (req, res) => {
  try {
    const id = req.query.id
    const hpackage = await healthPackageModel.findById(id)
    res.json({ hpackage, discount: 0 })
  } catch (err) { res.json(err.message) }
}

const getHealthPackageForFamily = async (req, res) => {
  try {
    const id = req.query.id
    const name = req.query.name
    const patientId = req.user._id
    const patient = await patientModel.findById(patientId)
    let discount = 0
    for (let i = 0; i < patient.familyMembers.length; i++) {
      const familyMember = await familyModel.findById(patient.familyMembers[i].toString())
      if (familyMember.name === name) {
        if (id === familyMember.healthPackageDiscount.healthPackageID.toString()) {
          discount = familyMember.healthPackageDiscount.discount
        }
        break;
      }
    }
    const hpackage = await healthPackageModel.findById(id)
    res.json({ hpackage, discount })
  } catch (err) { res.json(err.message) }
}

const getDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({})
    const clinicMarkUp = process.env.CLINIC_MARKUP;
    const patientId = req.user._id;
    const patient = await patientModel.findById(patientId);
    let discount = 1
    if (patient.healthPackage) {
      const healthPackageID = patient.healthPackage.healthPackageID.toString()
      const healthPackage = await healthPackageModel.findById(healthPackageID).catch(err => console.log(err.message))
      discount = 1 - healthPackage.doctorDiscount / 100;
    }
    let data = []
    for (let index = 0; index < doctors.length; index++) {
      const element = doctors[index]._doc;
      const sessionPrice = ((element.hourlyRate + 10 / 100 * clinicMarkUp) * discount)
      // console.log(sessionPrice)
      data.push({ ...element, sessionPrice: sessionPrice });
    }
    res.status(200).json(data)
  }

  catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const viewFreeAppointments = async (req, res) => {
  try {
    const allAppointments = await appointmentModel.find({ status: "free" }).populate({ path: "doctor" })
    const clinicMarkUp = process.env.CLINIC_MARKUP;
    const patientId = req.user._id;
    const patient = await patientModel.findById(patientId);

    let discount = 1
    if (patient.healthPackage) {
      const healthPackageID = patient.healthPackage.healthPackageID.toString()
      const healthPackage = await healthPackageModel.findById(healthPackageID).catch(err => console.log(err.message))
      discount = 1 - healthPackage.doctorDiscount / 100;
    }
    const result = allAppointments.map(app => { return { appointment: app, price: (app.doctor.hourlyRate + 10 / 100 * clinicMarkUp) * discount } })
    res.json(result)
  }
  catch (err) { console.log(err) }
}

const viewFreeAppointmentsByName = async (req, res) => {
  try {
    const name = req.query.name
    const searchName = new RegExp(name, "i")
    const allAppointments = await appointmentModel.find({ status: "free" }).populate({ path: "doctor" })
    const appointments = allAppointments.filter(app => searchName.test(app.doctor.name))
    const clinicMarkUp = process.env.CLINIC_MARKUP;
    const patientId = req.user._id;
    const patient = await patientModel.findById(patientId);

    let discount = 1
    if (patient.healthPackage) {
      const healthPackageID = patient.healthPackage.healthPackageID.toString()
      const healthPackage = await healthPackageModel.findById(healthPackageID).catch(err => console.log(err.message))
      discount = 1 - healthPackage.doctorDiscount / 100;
    }
    const result = appointments.map(app => { return { appointment: app, price: (app.doctor.hourlyRate + 10 / 100 * clinicMarkUp) * discount } })
    res.json(result)
  }
  catch (err) { console.log(err) }
}

const getAnAppointment = async (req, res) => {
  try {
    const appointmentId = req.query.id
    const appointment = await appointmentModel.findById(appointmentId).populate({ path: 'doctor' })
    const doctor = appointment.doctor
    const patientId = req.query.patientId
    const patient = await patientModel.findById(patientId)
    const clinicMarkUp = process.env.CLINIC_MARKUP
    let price = doctor.hourlyRate + clinicMarkUp
    let discount = 1
    if (patient.healthPackage) {
      const healthPackageID = patient.healthPackage.healthPackageID.toString()
      const healthPackage = await healthPackageModel.findById(healthPackageID).catch(err => console.log(err.message))
      discount = 1 - healthPackage.doctorDiscount / 100;
    }

    const response = { appointment: appointment, price: (doctor.hourlyRate + 10 / 100 * clinicMarkUp) * discount }
    res.json(response)
  }
  catch (err) {
    console.log(err.message)
  }
}


const uploadHealthRecord = async (req, res) => {
  try {

    let id = req.user._id;
    if (req.query.id && req.query.id !== "null")
      id = req.query.id;

    let healthRecord = req.body.base64;
    let patient = await healthRecordsModel.findOne({patient : id});
    if (patient)
      patient.HealthRecords.push(healthRecord);
    else
       patient = await healthRecordsModel.create({patient : id, HealthRecords : [healthRecord]});
    await patient.save();
    res.json('Health record added successfully');
  } catch (error) {
    res.json('Internal server error');
  }
}

const getHealthRecords = async (req, res) => {
  try {

    let id = req.user._id;
    if (req.query.id && req.query.id !== "null")
      id = req.query.id;

    let patient = await healthRecordsModel.findOne({patient : id});
    let healthRecords = [];
    if (patient)
      healthRecords = patient.HealthRecords;
    res.json(healthRecords);
  } catch (error) {
    res.json('Internal server error');
  }
}

const deleteHealthRecord = async (req, res) => {
  try{
    let id = req.user._id;
    if (req.query.id && req.query.id !== "null")
      id = req.query.id;
    const index = req.body.index;
    let patient = await healthRecordsModel.findOne({patient : id});
    patient.HealthRecords.splice(index, 1);
    await patient.save();
    res.json("Health Record deleted succesfully.")

  } catch (error){
    res.json('Internal server error');
  }
}

//New Req.19//
const linkFamilyMemberAccount = async (req, res) => {
  try {
    const patientId = new mongoose.Types.ObjectId(req.query.id);
    const { email, phone, relationToPatient } = req.body;

    // Validate that the relation is restricted to wife/husband/children
    const allowedRelations = ["wife", "husband", "children"];
    if (!allowedRelations.includes(relationToPatient)) {
      return res.json({
        error: "Invalid relation. Relation must be wife, husband, or children.",
      });
    }

    // Find the primary patient
    const primaryPatient = await patientModel.findById(patientId);
    if (!primaryPatient) {
      return res.json({ error: "Primary patient not found." });
    }

    // Find the patient to link
    const familyMemberToLink = await patientModel.findOne({
      $or: [{ email }, { mobileNumber: phone }],
    });

    if (!familyMemberToLink) {
      return res.json({ error: "Family member not found." });
    }

    // Check if the patient to link is not the same as the primary patient
    if (familyMemberToLink._id.equals(primaryPatient._id)) {
      return res.json({
        error: "Cannot link the primary patient's account as a family member.",
      });
    }

    // Check if the patient is not already linked
    const existingFamilyMember = await familyModel.findOne({
      patient: primaryPatient._id,
      familyMember: familyMemberToLink._id,
    });

    if (existingFamilyMember) {
      return res.json({ error: "Family member is already linked to the patient." });
    }

    // console.log(primaryPatient)
    // Create a family member entry
    const familyMember = await familyModel.create({
      patient: primaryPatient._id,
      familyMember: familyMemberToLink._id,
      relationToPatient,
      name: familyMemberToLink.name,
      age: calculateAge(familyMemberToLink.birthDate),
      //nationalId: Math.floor(Math.random() * 10000),
      nationalId: familyMemberToLink.nationalId,
      gender: familyMemberToLink.gender
    });
    // Update the primary patient's family members
    primaryPatient.familyMembers.push(familyMember._id);
    await primaryPatient.save();

    res.json("Family member linked successfully.");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function calculateAge(birthDate) {
  const today = new Date();
  const birthDateObj = new Date(birthDate);

  let age = today.getUTCFullYear() - birthDateObj.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - birthDateObj.getUTCMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < birthDateObj.getUTCDate())) {
    age--;
  }

  return age;
}
// const getVideoChattingRoomDoctor = async (req, res) => {
//   const partner1Id = (req.user._id).toString();
//   console.log(partner1Id)
//   const partner2Id = req.query.partner;
//   console.log(partner2Id)

//   try {
  
//     let room = await VideoChatRoom.findOne({
//    patientId :partner1Id, doctorId :partner2Id},
//    );
//     console.log(room);
    
//     if (!room && partner1Id !== partner2Id) {
//       room = await VideoChatRoom.create({ doctorId :partner1Id,  patientId:partner2Id });

//       room.save();
//     }
//     res.json(room);
//   } catch (error) {
//     res.json({ error: 'Error retrieving chat room', message: error.message });
//   }
// };


const getVideoChattingRoom = async (req, res) => {
  const partner1Id = (req.user._id).toString();
  console.log(partner1Id)
  const partner2Id = req.query.partner;
  console.log(partner2Id)

  try {
  
    let room = await VideoChatRoom.findOne({
   patientId :partner1Id, doctorId :partner2Id},
   );
    console.log(room);
    
    if (!room && partner1Id !== partner2Id) {
      room = await VideoChatRoom.create({ patientId :partner1Id,  doctorId:partner2Id });

      await room.save();
    }
    res.json(room );
  } catch (error) {
    res.json({ error: 'Error retrieving chat room', message: error.message });
  }
};


module.exports = {
  createFamilyMember,
  searchForDoctorByNameSpeciality,
  filterAppointmentsForPatient,
  getFamilyMembers,
  filterPrescriptionByDateDoctorStatus,
  filterDoctorsSpecialityDate,
  selectDoctorFromFilterSearch,
  viewMyPrescriptions,
  selectPrescription,
  getDoctors,
  getMedicines,
  getSubMedicines,
  linkFamilyMemberAccount,
  viewPatientAppointments,
  buyHealthPackage,
  reserveAppointment,
  getHealthPackageForPatient,
  viewFreeAppointments,
  getAnAppointment,
  uploadHealthRecord,
  getHealthRecords,
  viewMySubscribedHealthPackage,
  CancelSubscription,
  ViewMyWallet,
  viewFreeAppointmentsByName,
  getHealthPackageForFamily,
  searchMedicinePatient,
  filterByMedicinalUsePatient,
  addPatient,
  addToCart,
  viewMyCart,
  removeFromCart,
  increaseByOne,
  decreaseByOne,
  payWithCard,
  payWithWallet,
  sendCheckoutMail,
  getAllAddresses,
  cashOnDelivery,
  pastOrders,
  cancelOrder,
  deleteHealthRecord,
  getVideoChattingRoom,
  updateSocketId,
  getSocketId
};
