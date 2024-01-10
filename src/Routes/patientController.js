const familyModel = require("../Models/FamilyMember.js");
const patientModel = require("../Models/Patient.js");
const appointmentModel = require("../Models/Appointment.js");
const doctorModel = require("../Models/Doctor.js");
const medicineModel = require("../Models/Medicine.js");
const prescriptionModel = require("../Models/Prescription.js");
const healthPackageModel = require("../Models/HealthPackage.js");
const userModel = require("../Models/User.js");
const orderModel = require("../Models/Order.js");
const adminModel = require("../Models/Admin");
const healthRecordsModel = require("../Models/HealthRecords.js");
const pharmacistModel = require("../Models/Pharmacist.js");
const mongoose = require("mongoose");
const notificationSystemModel = require("../Models/NotificationSystem.js");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require("dotenv").config();
const ChattingRoomModel = require("../Models/ChattingRoom.js");




const addPatient = async (req, res) => {
  const {
    username,
    name,
    email,
    password,
    birthDate,
    gender,
    mobileNumber,
    emergencyContact,
    nationalId,
  } = req.body;
  try {
    if (
      !username ||
      !password ||
      !name ||
      !birthDate ||
      !gender ||
      !mobileNumber ||
      !emergencyContact ||
      !email ||
      !nationalId
    ) {
      return res.json({
        success: false,
        message:
          "All fields are required. Please provide valid information for each field!",
      });
    }
    const user = await userModel.findOne({ username });
    if (user) {
      res.json("Username already exists");
    } else {
      const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%^&*()?[\]{}|<>])[A-Za-z\d@$!%^&*()?[\]{}|<>]{10,}$/;
      if (!passwordRegex.test(password)) {
        return res.json({
          success: false,
          message:
            "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character, and be at least 10 characters long.",
        });
      }

      const salt = await bcrypt.genSalt();
      const encryptedPassword = await bcrypt.hash(password, salt);
      const patient = await patientModel.create({
        username,
        name,
        email,
        password: encryptedPassword,
        birthDate,
        gender,
        mobileNumber,
        emergencyContact,
        cart: { items: [], amountToBePaid: 0 },
        nationalId,
      });
      await patient.save();

      const user = await userModel.create({
        username,
        userId: patient._id,
        type: "patient",
      });
      await user.save();

      res.json("Registered Successfully !!");
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};

const filterByMedicinalUsePatient = async (req, res) => {
  const searchName = req.query.medicinalUse;
  if (searchName.length < 3) {
    return res.json("Search query must be at least three characters");
  }
  const medUse = new RegExp(searchName, "i");

  try {
    const results = await medicineModel.find({ medicinalUse: medUse });
    if (results.length == 0) {
      res.json("Medicine is not Found !!");
    } else {
      res.json(results);
    }
  } catch (err) {
    res.json({ message: err.message });
  }
};

const searchMedicinePatient = async (req, res) => {
  const searchName = req.query.name;
  if (searchName.length < 3) {
    return res.json("Search query must be at least three characters");
  }
  const searchQuery = new RegExp(searchName, "i"); // 'i' flag makes it case-insensitive

  try {
    const results = await medicineModel.find({
      name: searchQuery,
      stockQuantity: { $gt: 0 },
    });

    if (results.length === 0) {
      return res.json("Medicine is not Found !!");
    } else {
      return res.json(results);
    }
  } catch (error) {
    res.json(error.message);
  }
};

const viewMyCart = async (req, res) => {
  try {
    const patientId = req.user._id;
    const patient = await patientModel.findById(patientId).populate({
      path: "cart.items.medicine",
      model: "Medicine",
    });
    if (!patient) {
      return res.json({ message: "Patient not found" });
    }

    const cart = patient.cart;

    res.json({ success: true, cart: cart, wallet: patient.wallet });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

const cartvalue = async (patientId) => {
  try {
    const patient = await patientModel.findById(patientId).populate({
      path: "cart.items.medicine",
      model: "Medicine",
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
        const purchaseTime = new Date();
        expiryTime.setFullYear(expiryTime.getFullYear() + 1);
        addNotification(
          "Pharmacist",
          "",
          "Stock alert",
          `Medicine "${medicine.name}" is out of stock. Please restock.`,
          expiryTime,
          purchaseTime
        );

        const pharmacists = await pharmacistModel.find();
        for (pharmacist of pharmacists) {
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
            to: pharmacist.email,
            subject: "Stock alert",
            text: `Medicine "${medicine.name}" is out of stock. Please restock.`,
          };
          try {
            const info = await transporter.sendMail(mailOptions);
          } catch (error) {
            console.error("Error sending email:", error);
          }
        }
      }
      await medicine.save();
    }

    const patient = await patientModel.findById(id);
    patient.cart.items = [];
    patient.cart.amountToBePaid = 0;
    await patient.save();
  } catch (error) {
    console.error("Error updating medicine quantities:", error.message);
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
    console.error("Error updating medicine quantities:", error.message);
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
    order.status = "Cancelled";
    await order.save();
    await patient.save();
    handleAfterCancel(order.items);
    res.status(200).json({
      success: true,
      title: "Order Cancelled Successfully",
    });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  const stringMedicineId = req.body.medicineId;
  const medicineId = new mongoose.Types.ObjectId(stringMedicineId);
  const quantity = parseInt(req.body.quantity);

  try {
    const medicine = await medicineModel.findById(stringMedicineId);
    const patientId = req.user._id;
    const patient = await patientModel.findById(patientId);
    let oldcart = await cartvalue(patientId);
    if (medicine.prescriptionMedicine === true) {
      try {
        let prescriptions = [];
        const date = new Date();
        prescriptions = await prescriptionModel.find({ patient: patientId });

        const filteredPrescriptions = prescriptions.filter((prescription) => {
          const prescriptionDate = new Date(prescription.dateFilled);
          const timeDifference = date.getTime() - prescriptionDate.getTime();
          const daysDifference = timeDifference / (1000 * 3600 * 24);
          return daysDifference < 3;
        });
        let isFound = false;
        for (const prescription of filteredPrescriptions) {
          for (const prescribedMedicine of prescription.medicines) {
            if (
              prescribedMedicine.medId.toString() === medicine._id.toString()
            ) {
              isFound = true;
            }
          }
        }
        if (!isFound)
          return res.json({
            message:
              "The specified prescription medicine wasn't found in any of your recent prescriptions.",
            success: false,
            title: "Disallowed action",
          });
      } catch (error) {
        console.error("Error fetching prescriptions:", error.message);
      }
    }
    if (!medicine) {
      return res.json({
        message: "Medicine not found",
        success: false,
        title: "Medicine Error",
      });
    }

    if (quantity > medicine.stockQuantity) {
      return res.json({
        message: "Requested quantity exceeds available stock",
        success: false,
        title: "Quantity Problem",
      });
    }

    if (quantity > 0) {
      const existingCartItemIndex = patient.cart.items.findIndex(
        (item) => item.medicine.toString() === medicineId.toString()
      );
      if (existingCartItemIndex !== -1) {
        if (
          patient.cart.items[existingCartItemIndex].quantity + quantity >
          medicine.stockQuantity
        )
          return res.json({
            message: "Requested quantity exceeds available stock",
            success: false,
            title: "Quantity Problem",
          });
        else patient.cart.items[existingCartItemIndex].quantity += quantity;
      } else {
        patient.cart.items.push({ medicine: medicineId, quantity });
      }

      let price = medicine.price;
      let package_Id = null;
      if (patient.healthPackage) {
        package_Id = patient.healthPackage.healthPackageID;
      }

      if (!package_Id) patient.cart.amountToBePaid += price * quantity;
      else {
        let package = await healthPackageModel.findById(package_Id);
        let ratio = package.medicineDiscount;
        let percentage = 1 - ratio / 100;
        patient.cart.amountToBePaid += price * quantity * percentage;
      }

      await patient.save();
      let modifiedcart = await cartvalue(patientId);

      res.json({
        message: "Medicine added to cart successfully",
        success: true,
        title: "Successful add",
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
      success: false,
      title: "An error occurred",
    });
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
    const removedItem = patient.cart.items.find(
      (item) => item.medicine.toString() === medicineId.toString()
    );
    const quantity = removedItem.quantity;

    let price = medicine.price;
    let package_Id = null;
    if (patient.healthPackage) {
      package_Id = patient.healthPackage.healthPackageID;
    }

    if (!package_Id) {
      patient.cart.amountToBePaid -= price * quantity;
    } else {
      let package = await healthPackageModel.findById(package_Id);
      let ratio = package.medicineDiscount;
      let percentage = 1 - ratio / 100;
      patient.cart.amountToBePaid -= price * quantity * percentage;
    }
    patient.cart.items = patient.cart.items.filter(
      (item) => item.medicine.toString() !== medicineId.toString()
    );
    await patient.save();
    let modifiedcart = await cartvalue(patientId);
    res.status(200).json({
      message: `Medicine removed from cart successfully`,
      cart: modifiedcart,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addNotification = async (
  type,
  Id,
  title,
  message,
  showtime,
  expiryTime
) => {
  let user;

  switch (type) {
    case "Admin":
      user = await adminModel.findById(Id);
      break;
    case "Doctor":
      user = await doctorModel.findById(Id);
      break;
    case "Patient":
      user = await patientModel.findById(Id);
      break;
    default:
      throw new Error("Invalid user type");
  }

  if (!user) {
    throw new Error(`No ${type} found with provided ID`);
  }

  // Create the notification
  const notification = await notificationSystemModel.create({
    type,
    Id,
    title,
    message,
    expiryTime,
  });
  await notification.save();
};

const getMedicines = async (req, res) => {
  try {
    const results = await medicineModel.find({ archived: false });
    res.json(results);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getSubMedicines = async (req, res) => {
  const activeIngredient = req.query.activeIngredient;

  try {
    const results = await medicineModel.find({
      activeIngredient,
      stockQuantity: { $gt: 0 },
    });
    if (results.length === 0) {
      res.json({ medicines: results, message: "There is no substitute!" });
    } else {
      res.json({ medicines: results, message: "Done" });
    }
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
    const existingCartItemIndex = patient.cart.items.findIndex(
      (item) => item.medicine.toString() === medicineId.toString()
    );
    if (
      patient.cart.items[existingCartItemIndex].quantity + 1 >
      medicine.stockQuantity
    ) {
      res.status(200).json({
        message: "Requested quantity exceeds available stock",
        cart: oldcart,
      });
      return;
    } else {
      patient.cart.items[existingCartItemIndex].quantity += 1;
    }

    let price = medicine.price;
    let package_Id = null;
    if (patient.healthPackage) {
      package_Id = patient.healthPackage.healthPackageID;
    }

    if (!package_Id) {
      patient.cart.amountToBePaid += price;
    } else {
      let package = await healthPackageModel.findById(package_Id);
      let ratio = package.medicineDiscount;
      let percentage = 1 - ratio / 100;
      patient.cart.amountToBePaid += price * percentage;
    }

    await patient.save();
    let modifiedcart = await cartvalue(patientId);
    res
      .status(200)
      .json({ message: `Medicine increased successfully`, cart: modifiedcart });
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
    const existingCartItemIndex = patient.cart.items.findIndex(
      (item) => item.medicine.toString() === medicineId.toString()
    );

    if (patient.cart.items[existingCartItemIndex].quantity == 1) {
      patient.cart.items = patient.cart.items.filter(
        (item) => item.medicine.toString() !== medicineId.toString()
      );
      await patient.save();
      msg = `Medicine removed from cart successfully`;
    } else {
      patient.cart.items[existingCartItemIndex].quantity -= 1;
      msg = `Medicine decreased successfully`;
    }
    let price = medicine.price;
    let package_Id = null;
    if (patient.healthPackage) {
      package_Id = patient.healthPackage.healthPackageID;
    }
    if (!package_Id) {
      patient.cart.amountToBePaid -= price;
    } else {
      let package = await healthPackageModel.findById(package_Id);
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
    if (!patient) return res.send("No such patient found in the database.");
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
        return res.json({ success: false, message: "Doctor is not Found!!" });
      }

      const doctorIds = doctors.map((doctor) => doctor._id);
      baseQuery["doctor"] = { $in: doctorIds };
    } catch (error) {
      return res.json({ success: false, message: error.message });
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
      return res.json({ success: false, message: "No prescriptions found!" });
    }
    let extendedPrescriptions = [];
    for (prescription of prescriptions) {
      let doctorr = await doctorModel.findOne(prescription.doctor._id);
      const extendedPrescription = {
        ...prescription.toObject(),
        doctor: doctorr.name,
      };
      extendedPrescriptions.push(extendedPrescription);
    }
    return res.json({ success: true, prescriptions: extendedPrescriptions });
  } catch (err) {
    return res.json({ success: false, message: "Internal Server Error" });
  }
};

const filterAppointmentsForPatient = async (req, res) => {
  const dateToBeFiltered = req.query.date;
  const statusToBeFiltered = req.query.status;
  const filterQuery = {};

  if (dateToBeFiltered) {
    const dateParam = dateToBeFiltered;
    const startDate = new Date(dateParam);
    const endDate = new Date(dateParam);
    endDate.setDate(endDate.getDate() + 1);
    filterQuery["date"] = { $gte: startDate, $lt: endDate };
  }

  if (statusToBeFiltered) {
    filterQuery["status"] = statusToBeFiltered;
  }
  const id = req.user._id;
  filterQuery["patient"] = new mongoose.Types.ObjectId(id);
  try {
    const filteredAppointments = await appointmentModel
      .find(filterQuery)
      .populate({ path: "doctor" });
    if (filteredAppointments.length === 0) {
      return res.json({
        success: false,
        title: "No matching appointments found for the Patient.",
      });
    }
    const currentDate = new Date();
    let upcomingAppointments = [];
    let cancelledAppointments = [];
    let completedAppointments = [];
    let requestedAppointments = [];
    for (appointment of filteredAppointments) {
      if (appointment.status === "upcoming")
        upcomingAppointments.push(appointment);
      else if (appointment.status === "cancelled")
        cancelledAppointments.push(appointment);
      else if (appointment.status === "completed")
        completedAppointments.push(appointment);
      else requestedAppointments.push(appointment);
    }
    const appointmentData = {
      upcomingAppointments,
      cancelledAppointments,
      completedAppointments,
      requestedAppointments,
    };
    res.json({ success: true, appointmentData });
  } catch (err) {
    console.error(err);
    res.json({ error: "An error occurred while retrieving appointments." });
  }
};

const selectDoctorFromFilterSearch = async (req, res) => {
  try {
    let doctorID = new mongoose.Types.ObjectId(req.query.id);
    const doctorList = await doctorModel.findById(doctorID);
    res.json(doctorList);
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};

const getFamilyMembers = async (req, res) => {
  try {
    const patientId = req.user._id;
    const patient = await patientModel
      .findById(patientId)
      .populate({ path: "familyMembers" });
      // console.log(patient)
      // console.log(result)
      const result = [patient.name]
      const familyMember = patient.familyMembers.map(fm => fm.name);
      const final = result.concat(familyMember)
    // console.log(final)
    res.json(final);
  } catch (err) {
    console.log(err.message)
    res.json(err.message);
  }
};

const viewMyPrescriptions = async (req, res) => {
  try {
    const patientId = req.user._id;
    const prescriptions = await prescriptionModel
      .find({ patient: patientId })
      .populate({ path: "medicines.medId" })
      .populate({ path: "doctor" })
      .exec();
    res.json({ success: true, prescriptions: prescriptions });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const selectPrescription = async (req, res) => {
  try {
    const prescriptionId = req.query.id;
    const prescription = await prescriptionModel
      .findById(prescriptionId)
      .populate({ path: "medicines.medId" })
      .populate({ path: "doctor" })
      .exec();
    res.json(prescription);
  } catch (error) {
    res.json({ error: error.message });
  }
};

const filterDoctorsSpecialityDate = async (req, res) => {
  try {
    let discount = 1;
    const clinicMarkUp = process.env.CLINIC_MARKUP;
    const patient = await patientModel.findById(req.user._id);
    if (patient.healthPackage) {
      const healthPackageID = patient.healthPackage.healthPackageID.toString();
      const healthPackage = await healthPackageModel.findById(healthPackageID);
      discount = 1 - healthPackage.doctorDiscount / 100;
    }

    if (req.query.date) {
      const dateParam = req.query.date;
      const startDate = new Date(dateParam);
      startDate.setHours(startDate.getHours() + 1)
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 1);


      let busyDoctors = await appointmentModel
        .find({ date: { $gte: startDate, $lt: endDate }, status: "upcoming" })
        .populate({ path: "doctor" });
      const busyDoctorsMapped = busyDoctors.map(
        (appointment) => appointment.doctor
      );
      let query = {};
      query["status"] = "accepted";
      if (req.query.name) {
        query["name"] = new RegExp(req.query.name, "i");
      }
      if (req.query.speciality) query["speciality"] = new RegExp(req.query.speciality, "i");
      let doctors = await doctorModel.find(query);

      let availableDoctors = [];
      for (let i = 0; i < doctors.length; i++) {
        let found = false;
        for (let j = 0; j < busyDoctorsMapped.length; j++) {
          if (doctors[i].username === busyDoctorsMapped[j].username) {
            found = true;
          }
        }
        if (!found) availableDoctors.push(doctors[i]);
      }

      const data = availableDoctors.map((element) => {
        const sessionPrice = (element.hourlyRate + (10 / 100) * clinicMarkUp) * discount;
        return { ...element.toObject(), sessionPrice };
      });

      res.json({ success: true, doctors: data });
    } else {
      let query = {};
      query["status"] = "accepted";
      if (req.query.speciality) query["speciality"] = new RegExp(req.query.speciality, "i");
      if (req.query.name) {
        query["name"] = new RegExp(req.query.name, "i");
      }
      let doctors = await doctorModel.find(query);

      const data = doctors.map((element) => {
        const sessionPrice = (element.hourlyRate + (10 / 100) * clinicMarkUp) * discount;
        return { ...element.toObject(), sessionPrice };
      });

      res.json({ success: true, doctors: data });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

const viewMySubscribedHealthPackage = async (req, res) => {
  try {
    const patientId = req.user._id;
    const patient = await patientModel
      .findById(patientId)
      .populate("healthPackage")
      .exec();

    const extendedHealthPackages = [];
    let extendedHealthPackage = {};
    const healthPackagePatient = patient.healthPackage;
    if (healthPackagePatient == undefined) return res.json({success: false, message: "The package you or your family members own is no longer on the system, please contact staff for support."});
    else {
      const status = healthPackagePatient.status;
      const endDate = healthPackagePatient.endDate;
      const healthPackage = await healthPackageModel.findById(
        healthPackagePatient.healthPackageID
      );
      extendedHealthPackage = {
        ...healthPackage.toObject(), // Spread properties from healthPackage
        status: status,
        endDate: endDate,
        patientName: patient.name,
        patientID: patient._id
      };
      extendedHealthPackages.push(extendedHealthPackage);
    }
    const familyMembersHealthPackages = [];
    // Process family members' health packages
    for (const familyMemberId of patient.familyMembers) {
      const familyMember = await familyModel
        .findById(familyMemberId)
        .populate("healthPackage")
        .exec();

      if (familyMember) {
        const healthPackageFamilyMember = familyMember.healthPackage;
        if (healthPackageFamilyMember != undefined) {
          const status = healthPackageFamilyMember.status;
          const endDate = healthPackageFamilyMember.endDate;
          const healthPackage = await healthPackageModel.findById(
            healthPackageFamilyMember.healthPackageID
          );
          const extendedHealthPackage = {
            ...healthPackage.toObject(),
            patientName: familyMember.name,
            status: status,
            endDate: endDate,
            patientID: familyMember._id
          };
          familyMembersHealthPackages.push(extendedHealthPackage);
        }
      }
    }

    res.json({success: true, myHealthPackage : extendedHealthPackage, familyMembersHealthPackages: familyMembersHealthPackages});
  } catch (err) {
    res.json({success: false, message: err.message});
  }
};

const CancelSubscription = async (req, res) => {
  try {
    const patientId = req.user._id;
    const patient = await patientModel.findById(patientId);
    if (!patient) {
      return res.json({ message: "Patient not found" });
    }
    patient.healthPackage.status = "cancelled";
    await patient.save();

    res.json({ message: "Subscription canceled successfully" });
  } catch (error) {
    console.error("Error canceling subscription:", error.message);
    res.json({ message: "Internal Server Error" });
  }
};

const ViewMyWallet = async (req, res) => {
  try {
    const patientId = req.user._id;
    const patient = await patientModel
      .findById(patientId)
      .populate("wallet")
      .exec();

    if (!patient) {
      console.log("Patient not found");
      return;
    }
    const wallet = patient.wallet;
    res.json(wallet);
  } catch (err) {
    res.json(err.message);
  }
};

const viewPatientAppointments = async (req, res) => {
  try {
    const patientID = req.user._id;
    const currentDate = new Date();

    const upcomingAppointments = await appointmentModel
      .find({
        patient: patientID,
        status: "upcoming",
      })
      .populate({ path: "doctor" });

    const pastAppointments = await appointmentModel
      .find({
        patient: patientID,
        status: "cancelled",
      })
      .populate({ path: "doctor" });

    const completedAppointments = await appointmentModel
      .find({
        patient: patientID,
        status: "completed",
      })
      .populate({ path: "doctor" });

    const requestedAppointments = await appointmentModel
      .find({
        patient: patientID,
        status: "requested",
      })
      .populate({ path: "doctor" });

    const appointmentData = {
      upcomingAppointments,
      pastAppointments,
      completedAppointments,
      requestedAppointments,
    };

    res.status(200).json(appointmentData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createOrder = async (
  firstName,
  lastName,
  patientId,
  address,
  items,
  total,
  method,
  status
) => {
  let package_Id = null;
  let discount = 0;
  const patient = await patientModel.findById(patientId);
  if (patient.healthPackage) {
    package_Id = patient.healthPackage.healthPackageID;
    let package = await healthPackageModel.findById(package_Id);
    discount = package.medicineDiscount;
  }
  const order = await orderModel.create({
    patient: patientId,
    address: address,
    items: items,
    total: total,
    paymentMethod: method,
    status: status,
    First_Name: firstName,
    Last_Name: lastName,
    discount: discount,
  });
  const savedOrder = await order.save();
  return (savedOrder._id).toString();
};

const createOrderPending = async (req,res) => {
   const id=req.user._id;
   const patient=await patientModel.findById(id).populate({ path: "cart.items.medicine" });
   const pendingOrder= await orderModel.findOneAndUpdate({status:'Pending'},{status:"Preparing"})
   const PendingorderWithMedicineDetails = await orderModel.findById(pendingOrder._id).populate({
    path: 'items.medicine',
    model: 'Medicine',
    select: 'name  price', 
  });

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
      subject: "Payment Confirmation",
      text:`Hello ${pendingOrder.First_Name} ${pendingOrder.Last_Name},
      
      Your payment of ${pendingOrder.total} $ using your credit card has been successfully processed.
      
      Here are the details of your order:
      
      Order Details:
      -------------------------
      ${PendingorderWithMedicineDetails.items.map(item => `
        ${item.medicine.name} - Quantity: ${item.quantity}, Price: ${item.medicine.price} $
      `).join('')}
      ${PendingorderWithMedicineDetails.discount !== 0 ? `Discount: ${PendingorderWithMedicineDetails.discount} %` : ''} 
      Delivery Address: ${pendingOrder.address}

      Order Number: ${pendingOrder._id}
      
      Thank you for your purchase!

      You will receive another email shortly containing the expected time of delivery. 

      If you have any further questions, feel free to contact us.
  
      Have a great day!`   
  };
  const info = await transporter.sendMail(mailOptions);
  handleAfterBuy(patient.cart, id);
  res.json("done");

 
};
const removeOrderPending = async (req,res) => {
  const id=req.user._id;
  const pendingOrder= await orderModel.findOneAndDelete({status:'Pending'});
  res.json("sorry");


};


const getUniqueCode = async (req, res) => {
  try {
    const patient = await patientModel.findById(req.user._id);
    res.json(patient.uniqueCode);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};









const payWithWalletCart = async (req, res) => {
  const patientId = req.user._id;
  const address = req.query.address;
  const firstName = req.query.firstName;
  const lastName = req.query.lastName;
  const patient = await patientModel.findById(patientId);
  const items = patient.cart.items;
  const price = patient.cart.amountToBePaid;
  try {
    if (patient.wallet < price) {
      return res.json({
        success: false,
        url: "/checkout",
        message: "Insufficient funds!",
      });
    }
    const newWallet = patient.wallet - price;
    const updatedPatient = await patientModel.findByIdAndUpdate(patient._id, {wallet: newWallet,});
    await patient.save();
    if (address && !patient.deliveryAddress.includes(address)) {
      patient.deliveryAddress.push(address);
      await patient.save();
    }
     const orderId = await createOrder(firstName,lastName,patientId,address,items,patient.cart.amountToBePaid,"wallet","Preparing")
    handleAfterBuy(patient.cart, patientId);

    const orderWithMedicineDetails = await orderModel.findById(orderId).populate({
      path: 'items.medicine',
      model: 'Medicine',
      select: 'name  price', 
    });

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
        subject: "Payment Confirmation",
        text:`Hello ${firstName} ${lastName},
        
        Your payment of ${price} $ using your wallet has been successfully processed.
        
        Here are the details of your order:
        
        Order Details:
        -------------------------
        ${orderWithMedicineDetails.items.map(item => `
          ${item.medicine.name} - Quantity: ${item.quantity}, Price: ${item.medicine.price} $
        `).join('')}
        ${orderWithMedicineDetails.discount !== 0 ? `Discount: ${orderWithMedicineDetails.discount} %` : ''} 
        Delivery Address: ${address}

        Order Number: ${orderId}
        
        Thank you for your purchase!

        You will receive another email shortly containing the expected time of delivery. 

        If you have any further questions, feel free to contact us.
    
        Have a great day!`   
    };
    const info = await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "done" });
  } catch (err) {
    res.json(err.message);
  }
};

const cashOnDelivery = async (req, res) => {
  const id = req.user._id;
  const patient = await patientModel.findById(id);
  const items = patient.cart.items;
  const address = req.query.address;
  const firstName = req.query.firstName;
  const lastName = req.query.lastName;
  const price = patient.cart.amountToBePaid;
  if (address && !patient.deliveryAddress.includes(address)) {
    patient.deliveryAddress.push(address);
    await patient.save();
  }
  const orderId= await createOrder(firstName,lastName,id,address,items,patient.cart.amountToBePaid,"cash On Delivery","Preparing");
  handleAfterBuy(patient.cart, id);
  const orderWithMedicineDetails = await orderModel.findById(orderId).populate({
    path: 'items.medicine',
    model: 'Medicine',
    select: 'name  price', 
  });


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
    subject: "Payment Confirmation",
    text: `
    Hello ${firstName} ${lastName},
    
    Your order has been successfully placed. Payment will be made through Cash on Delivery.
    
    Here are the details of your order:
    
    Order Details:
    -------------------------
    ${orderWithMedicineDetails.items.map(item => `
      ${item.medicine.name} - Quantity: ${item.quantity}, Price: ${item.medicine.price} $
    `).join('')}
    
    ${orderWithMedicineDetails.discount !== 0 ? `Discount: ${orderWithMedicineDetails.discount} %` : ''} 
    
    Delivery Address: ${address}

    Order Number: ${orderId}
    
    Please have the exact amount ready for payment upon delivery.
    
    Thank you for your purchase! 

    You will receive another email shortly containing the expected time of delivery. 
    
    If you have any further questions, feel free to contact us.

    Have a great day!
  ` 
};
const info = await transporter.sendMail(mailOptions);




  res.json({ success: true });
};

const payWithCardCart = async (req, res) => {
  const id = req.user._id;
  const patient = await patientModel
    .findById(id)
    .populate({ path: "cart.items.medicine" });
  let ratio = 1;
  if (patient.healthPackage) {
    const package = await healthPackageModel.findById(
      patient.healthPackage.healthPackageID
    );
    ratio = 1 - package.medicineDiscount / 100;
  }
  const items = patient.cart.items;
  const address = req.query.address;
  const firstName = req.query.firstName;
  const lastName = req.query.lastName;
  const uniqueCode=Math.random().toString(36).substring(2, 10) +
  Math.random().toString(36).substring(2, 10);
  patient.uniqueCode=uniqueCode;
  await patient.save();

  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: items.map((item) => {
      const storeItem = {};
      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.medicine.name,
          },
          unit_amount: item.medicine.price * 100 * ratio,
        },
        quantity: item.quantity,
      };
    }),
    success_url: `http://localhost:3000/SuccessfulCheckout?code=${uniqueCode}`,
    cancel_url: `http://localhost:3000/CancelCheckout?code${uniqueCode}`,
  });
  if (address && !patient.deliveryAddress.includes(address)) {
    patient.deliveryAddress.push(address);
    await patient.save();
  }
 

  createOrder(
    firstName,
    lastName,
    id,
    address,
    items,
    patient.cart.amountToBePaid,
    "Credit Card",
    "Pending"

  );
 


  res.json({ url: session.url });
};


const payWithCardPackage = async (req, res) => {
  const patientId = req.user._id;
  const patient = await patientModel.findById(patientId);
 
  const item=req.query.item;  //1
  const packageId=item.ID;
  const price = item.price;
  const name= req.query.name; //2


  const uniqueCode=Math.random().toString(36).substring(2, 10) +
  Math.random().toString(36).substring(2, 10);
  patient.uniqueCode=uniqueCode;
  await patient.save();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Health Package",
          },
          unit_amount: item.price * 100,
        },
        quantity: 1,
      },
    ],
    success_url: `http://localhost:3000/SuccessfulCheckoutPackage?code=${uniqueCode}&id=${packageId}&name=${name}`,
    cancel_url: `http://localhost:3000/CancelCheckout?code=${" "}`
  });
  res.json({ url: session.url });
};





const payWithWallet = async (req, res) => {
  const patientId = req.user._id;
  const price = req.query.price;
  try {
    const patient = await patientModel.findById(patientId);
    if (patient.wallet < price) {
      return res.json({ success: false, title: "Insufficient funds!" });
    }
    const newWallet = patient.wallet - price;
    await patientModel.findByIdAndUpdate(patient._id, {
      wallet: newWallet,
    });
    res.json({ success: true });
  } catch (err) {
    res.json(err.message);
  }
};



const pastOrders = async (req, res) => {
  try {
    const patientId = req.user._id;

    const orders = await orderModel
      .find({ patient: patientId, status: { $ne: "Cancelled" } })
      .populate({
        path: "items.medicine",
        model: "Medicine",
      });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const buyHealthPackage = async (req, res) => {
  const patientId = req.user._id;
  const name = req.body.name;
  const healthPackageId = req.body.healthPackageId;
  try {
    const curDate = new Date();
    curDate.setMonth(curDate.getMonth() + 1);
    const healthPackage = await healthPackageModel.findById(healthPackageId);
    const hPackage = {
      healthPackageID: healthPackageId,
      status: "subscribed",
      endDate: curDate,
    };
    const patient = await patientModel.findById(patientId);
    if (name === patient.name) {
      patient["healthPackage"] = hPackage;
      patient.familyMembers.map((fm) => {
        const update = async (fm) => {
          await familyModel.findByIdAndUpdate(fm.toString(), {
            healthPackageDiscount: {
              healthPackageID: healthPackageId,
              discount: healthPackage.familyDiscount,
            },
          });
        };
        update(fm);
      });
      await patient.save();
    } else {
      patient.familyMembers.map((fm) => {
        const check = async (fm) => {
          const familyMember = await familyModel.findById(fm);
          if (familyMember.name === name) {
            familyMember["healthPackage"] = hPackage;
            await familyMember.save();
          }
        };
        check(fm);
      });
    }
    res.json("Updated Successfully");
  } catch (err) {
    res.json(err.message);
  }
};

const reserveAppointment = async (req, res) => {
  const patientId = req.user._id;
  const appointmentId = req.body.appointmentId;
  const name = req.body.name;
  const date = req.body.date;
  const app = await appointmentModel.findById(appointmentId);
  const doctorID = app.doctor;
  const doctor = await doctorModel.findById(doctorID);
  const clinicMarkup = process.env.CLINIC_MARKUP;
  let discount = 1;
  const patient = await patientModel.findById(patientId);
  const followup = req.body.f;
  if (patient.healthPackage) {
    const healthPackageID = patient.healthPackage.healthPackageID.toString();
    const healthPackage = await healthPackageModel
      .findById(healthPackageID)
      .catch((err) => console.log(err.message));
    discount = 1 - healthPackage.doctorDiscount / 100;
  }
  let appointment;
  try {
    if (followup) {
      // appointment = await appointmentModel.findByIdAndUpdate(
      //   appointmentId,
      //   {
      //     patient: new mongoose.Types.ObjectId(patientId),
      //     status: "requested",
      //     attendantName: name,
      //     price: (doctor.hourlyRate + (10 / 100) * clinicMarkup) * discount,
      //   },
      //   { new: true }
      appointment = await appointmentModel.create({
        patient: new mongoose.Types.ObjectId(patientId),
        doctor: new mongoose.Types.ObjectId(doctorID),
        status: "requested",
        date: date,
        attendantName: name,
        price: (doctor.hourlyRate + (10 / 100) * clinicMarkup) * discount,
      });
    } else
      appointment = await appointmentModel.findByIdAndUpdate(
        appointmentId,
        {
          patient: new mongoose.Types.ObjectId(patientId),
          status: "upcoming",
          attendantName: name,
          price: (doctor.hourlyRate + (10 / 100) * clinicMarkup) * discount,
        },
        { new: true }
      );
    await prescriptionModel.create({
      doctor: appointment.doctor,
      patient: new mongoose.Types.ObjectId(patientId),
      appointment: appointment._id,
    });
    const expiryTime = new Date();
    const notificationDate = new Date();
    expiryTime.setFullYear(expiryTime.getFullYear() + 1);
    addNotification(
      "Doctor",
      doctorID,
      "Appointment Scheduled",
      `A new appointment at date ${appointment.date} with patient ${name} has been scheduled.`,
      expiryTime,
      notificationDate
    );
    addNotification(
      "Patient",
      patientId,
      "Appointment Booked",
      `You have booked an appointment with Dr.${doctor.name} on ${appointment.date}.`,
      expiryTime,
      notificationDate
    );
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
    const mailOptionsPatient = {
      from: process.env.NODEMAILER_EMAIL,
      to: patient.email,
      subject: "Appointment Booked",
      text: `You have booked an appointment with Dr.${doctor.name} on ${appointment.date}.`,
    };
    const mailOptionsDoctor = {
      from: process.env.NODEMAILER_EMAIL,
      to: doctor.email,
      subject: "Appointment Scheduled",
      text: `A new appointment at date ${appointment.date} with patient ${name} has been scheduled.`,
    };
    try {
      await transporter.sendMail(mailOptionsPatient);
      await transporter.sendMail(mailOptionsDoctor);
    } catch (error) {
      console.error("Error sending email:", error);
    }
    res.json({
      success: true,
      title: date ? "Created Successfully" : "Updated Successfully",
    });
  } catch (err) {
    res.json(err.message);
  }
};

const sendCheckoutMail = async (req, res) => {
  const patientId = req.user._id;
  const patient = await patientModel.findById(patientId);
  const message = req.query.message;
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
    subject: "Payment Confirmation",
    text: message,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    res.json({ message: "done" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
};

const getAllAddresses = async (req, res) => {
  const id = req.user._id;
  const patient = await patientModel.findById(id);
  res.json(patient.deliveryAddress);
};

const getHealthPackageForPatient = async (req, res) => {
  try {
    const id = req.query.id;
    const hpackage = await healthPackageModel.findById(id);
    res.json({ hpackage, discount: 0 });
  } catch (err) {
    res.json(err.message);
  }
};

const getHealthPackageForFamily = async (req, res) => {
  try {
    const id = req.query.id;
    const name = req.query.name;
    const patientId = req.user._id;
    const patient = await patientModel.findById(patientId);
    let discount = 0;
    for (let i = 0; i < patient.familyMembers.length; i++) {
      const familyMember = await familyModel.findById(
        patient.familyMembers[i].toString()
      );
      if (familyMember.name === name) {
        if (
          id === familyMember.healthPackageDiscount.healthPackageID.toString()
        ) {
          discount = familyMember.healthPackageDiscount.discount;
        }
        break;
      }
    }
    const hpackage = await healthPackageModel.findById(id);
    res.json({ hpackage, discount });
  } catch (err) {
    res.json(err.message);
  }
};

const getDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "accepted" });
    const clinicMarkUp = process.env.CLINIC_MARKUP;
    const patientId = req.user._id;
    const patient = await patientModel.findById(patientId);
    let discount = 1;
    if (patient.healthPackage) {
      const healthPackageID = patient.healthPackage.healthPackageID.toString();
      const healthPackage = await healthPackageModel
        .findById(healthPackageID)
        .catch((err) => console.log(err.message));
      discount = 1 - healthPackage.doctorDiscount / 100;
    }
    let data = [];
    for (let index = 0; index < doctors.length; index++) {
      const element = doctors[index]._doc;
      const sessionPrice =
        (element.hourlyRate + (10 / 100) * clinicMarkUp) * discount;
      // console.log(sessionPrice)
      data.push({ ...element, sessionPrice: sessionPrice });
    }
    res.json({ success: true, approved: data });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const viewFreeAppointments = async (req, res) => {
  try {
    const allAppointments = await appointmentModel
      .find({ status: "free" })
      .populate({ path: "doctor" });
    const clinicMarkUp = process.env.CLINIC_MARKUP;
    const patientId = req.user._id;
    const patient = await patientModel.findById(patientId);

    let discount = 1;
    if (patient.healthPackage) {
      const healthPackageID = patient.healthPackage.healthPackageID.toString();
      const healthPackage = await healthPackageModel
        .findById(healthPackageID)
        .catch((err) => console.log(err.message));
      discount = 1 - healthPackage.doctorDiscount / 100;
    }
    const result = allAppointments.map((app) => {
      return {
        appointment: app,
        price: (app.doctor.hourlyRate + (10 / 100) * clinicMarkUp) * discount,
      };
    });
    res.json(result);
  } catch (err) {
    console.log(err);
  }
};

const viewFreeAppointmentsByName = async (req, res) => {
  try {
    const name = req.query.name;
    const searchName = new RegExp(name, "i");
    const allAppointments = await appointmentModel
      .find({ status: "free" })
      .populate({ path: "doctor" });
    const appointments = allAppointments.filter((app) =>
      searchName.test(app.doctor.name)
    );
    const clinicMarkUp = process.env.CLINIC_MARKUP;
    const patientId = req.user._id;
    const patient = await patientModel.findById(patientId);

    let discount = 1;
    if (patient.healthPackage) {
      const healthPackageID = patient.healthPackage.healthPackageID.toString();
      const healthPackage = await healthPackageModel
        .findById(healthPackageID)
        .catch((err) => console.log(err.message));
      discount = 1 - healthPackage.doctorDiscount / 100;
    }
    const result = appointments.map((app) => {
      return {
        appointment: app,
        price: (app.doctor.hourlyRate + (10 / 100) * clinicMarkUp) * discount,
      };
    });
    res.json(result);
  } catch (err) {
    console.log(err);
  }
};

const getAnAppointment = async (req, res) => {
  try {
    const appointmentId = req.query.id;
    const appointment = await appointmentModel
      .findById(appointmentId)
      .populate({ path: "doctor" });
    const doctor = appointment.doctor;
    const patientId = req.query.patientId;
    const patient = await patientModel.findById(patientId);
    const clinicMarkUp = process.env.CLINIC_MARKUP;
    let price = doctor.hourlyRate + clinicMarkUp;
    let discount = 1;
    if (patient.healthPackage) {
      const healthPackageID = patient.healthPackage.healthPackageID.toString();
      const healthPackage = await healthPackageModel
        .findById(healthPackageID)
        .catch((err) => console.log(err.message));
      discount = 1 - healthPackage.doctorDiscount / 100;
    }
    const response = {
      appointment: appointment,
      price: (doctor.hourlyRate + (10 / 100) * clinicMarkUp) * discount,
    };
    res.json(response);
  } catch (err) {
    console.log(err.message);
  }
};

const uploadHealthRecord = async (req, res) => {
  try {
    let id = req.user._id;
    if (req.query.id && req.query.id !== "null") id = req.query.id;

    let healthRecord = req.body.base64;
    let patient = await healthRecordsModel.findOne({ patient: id });
    if (patient) patient.HealthRecords.push(healthRecord);
    else
      patient = await healthRecordsModel.create({
        patient: id,
        HealthRecords: [healthRecord],
      });
    await patient.save();
    res.json({ success: true, title: "Health Record Uploaded Successfully" });
  } catch (error) {
    res.json("Internal server error");
  }
};

const getHealthRecords = async (req, res) => {
  try {
    let id = req.user._id;
    if (req.query.id && req.query.id !== "null") id = req.query.id;

    let patient = await healthRecordsModel.findOne({ patient: id });
    let healthRecords = [];
    if (patient) healthRecords = patient.HealthRecords;
    if (healthRecords.length === 0) return res.json({ success: false });
    res.json({ success: true, healthRecords });
  } catch (error) {
    res.json("Internal server error");
  }
};

const deleteHealthRecord = async (req, res) => {
  try {
    let id = req.user._id;
    if (req.query.id && req.query.id !== "null") id = req.query.id;
    const index = req.body.index;
    let patient = await healthRecordsModel.findOne({ patient: id });
    patient.HealthRecords.splice(index, 1);
    await patient.save();
    res.json("Health Record deleted succesfully.");
  } catch (error) {
    res.json("Internal server error");
  }
};

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
      return res.json({
        error: "Family member is already linked to the patient.",
      });
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
      gender: familyMemberToLink.gender,
    });
    // Update the primary patient's family members
    primaryPatient.familyMembers.push(familyMember._id);
    await primaryPatient.save();

    res.json("Family member linked successfully.");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointmentID = req.body.appointmentID;
    const appointment = await appointmentModel
      .findById(appointmentID)
      .populate("doctor patient")
      .exec();
    const oldStatus = appointment.status;
    appointment.status = "cancelled";
    await appointment.save();
    if (oldStatus === "free") {
      return res.json({ success: true, title: "Slot Removed" });
    }
    // console.log(appointment)
    const appointmentDate = new Date(appointment.date);
    const currentDate = new Date();
    const timeDifference = appointmentDate - currentDate;
    const isWithin24Hours = timeDifference < 24 * 60 * 60 * 1000;
    const doctor = await doctorModel.findById(req.user._id);
    if (
      oldStatus !== "free" &&
      appointment.price &&
      (!isWithin24Hours || doctor)
    ) {
      const patientID = appointment.patient;
      const patient = await patientModel.findById(patientID);
      patient.wallet += appointment.price;
      await patient.save();
    }

    const expiryTime = new Date();
    const notificationDate = new Date();
    expiryTime.setFullYear(expiryTime.getFullYear() + 1);
    addNotification(
      "Doctor",
      appointment.doctor._id,
      "Appointment Cancelled",
      `Your appointment with patient ${appointment.attendantName} on ${appointment.date} has been cancelled.`,
      expiryTime,
      notificationDate
    );
    addNotification(
      "Patient",
      appointment.patient._id,
      "Appointment Cancelled",
      `Your appointment with Dr.${appointment.doctor.name} on ${appointment.date} has been cancelled.`,
      expiryTime,
      notificationDate
    );
    // console.log('done')
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
    const mailOptionsPatient = {
      from: process.env.NODEMAILER_EMAIL,
      to: appointment.patient.email,
      subject: "Appointment Cancelled",
      text: `Your appointment with Dr.${appointment.doctor.name} on ${appointment.date} has been cancelled.`,
    };
    const mailOptionsDoctor = {
      from: process.env.NODEMAILER_EMAIL,
      to: appointment.doctor.email,
      subject: "Appointment Cancelled",
      text: `Your appointment with patient ${appointment.attendantName} on ${appointment.date} has been cancelled.`,
    };
    try {
      await transporter.sendMail(mailOptionsPatient);
      await transporter.sendMail(mailOptionsDoctor);
    } catch (error) {
      console.log("Error sending email:", error);
    }

    return res.json({ success: true, title: "Appointment Cancelled" });
  } catch (error) {
    console.log(error.message);
    return res.json({ message: "error" });
  }
};

const addPrescriptionToCart = async (req, res) => {
  const prescriptionID = req.body.prescription;
  const prescription = await prescriptionModel.findById(prescriptionID);
  const patientID = prescription.patient;
  const patient = await patientModel.findById(patientID);
  const medicines = prescription.medicines;
  //start here
  for (requestedMedicine of medicines) {
    const medicine = await medicineModel.findById(requestedMedicine.medId);
    if (medicine.archived === true)
      return res.json({
        success: false,
        message:
          "One of the medicine is currently not being sold by our pharmacy, please buy these medicines seperately.",
      });
    if (requestedMedicine.dosage > medicine.stockQuantity) {
      return res.json({
        success: false,
        message:
          "Requested quantity of a certain medicine exceeds available stock, please buy these medicines seperately.",
      });
    }

    const existingCartItemIndex = patient.cart.items.findIndex(
      (item) => item.medicine.toString() === requestedMedicine.medId.toString()
    );
    if (existingCartItemIndex !== -1) {
      if (
        patient.cart.items[existingCartItemIndex].quantity +
        requestedMedicine.dosage >
        medicine.stockQuantity
      )
        return res.json({
          success: false,
          message:
            "Requested quantity of a certain medicine exceeds available stock, please buy these medicines seperately.",
        });
      else
        patient.cart.items[existingCartItemIndex].quantity +=
          requestedMedicine.dosage;
    } else {
      patient.cart.items.push({
        medicine: requestedMedicine.medId,
        quantity: requestedMedicine.dosage,
      });
    }

    let price = medicine.price;
    let package_Id = null;
    if (patient.healthPackage) {
      package_Id = patient.healthPackage.healthPackageID;
    }

    if (!package_Id)
      patient.cart.amountToBePaid += price * requestedMedicine.dosage;
    else {
      let package = await healthPackageModel.findById(package_Id);
      let ratio = package.medicineDiscount;
      let percentage = 1 - ratio / 100;
      patient.cart.amountToBePaid +=
        price * requestedMedicine.dosage * percentage;
    }

    await patient.save();
  }
  prescription.sentToPharmacy = true;
  await prescription.save();
  res.json({
    success: true,
    message: "Prescriptions items added to cart successfully.",
  });
  //end here
};

function calculateAge(birthDate) {
  const today = new Date();
  const birthDateObj = new Date(birthDate);

  let age = today.getUTCFullYear() - birthDateObj.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - birthDateObj.getUTCMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getUTCDate() < birthDateObj.getUTCDate())
  ) {
    age--;
  }

  return age;
}

const getChattingRoom = async (req, res) => {
  const partner1Id = req.user._id.toString();
  const partner2Id = req.query.partner;
  try {
    let room = await ChattingRoomModel.findOne({
      $or: [
        { $and: [{ partner1Id: partner1Id }, { partner2Id: partner2Id }] },
        { $and: [{ partner1Id: partner2Id }, { partner2Id: partner1Id }] },
      ],
    });

    if (!room && partner1Id !== partner2Id) {
      room = await ChattingRoomModel.create({ partner1Id, partner2Id });
    }
    res.json(room);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving chat room", message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const messageContent = req.body.messageContent;
    const receiverId = req.body.receiverId;
    const senderId = req.user._id.toString();

    let sender =
      (await patientModel.findById(senderId)) ||
      (await pharmacistModel.findById(senderId)) ||
      (await doctorModel.findById(senderId));
    if (!sender) {
      throw new Error("Sender not found");
    }

    let receiver =
      (await patientModel.findById(receiverId)) ||
      (await pharmacistModel.findById(receiverId)) ||
      (await doctorModel.findById(receiverId));
    if (!receiver) {
      throw new Error("Receiver not found");
    }

    let senderChats = sender.chats;
    let receiverChats = receiver.chats;

    let chatWithReceiver = senderChats.find(
      (chat) => chat.partner === receiverId
    );
    if (!chatWithReceiver) {
      chatWithReceiver = {
        partner: receiverId,
        messages: [],
      };
      chatWithReceiver.messages.push({
        status: "Sent",
        content: messageContent,
      });

      senderChats.push(chatWithReceiver);
    }

    chatWithReceiver.messages.push({
      status: "Sent",
      content: messageContent,
    });

    let chatWithSender = receiverChats.find(
      (chat) => chat.partner === senderId
    );
    if (!chatWithSender) {
      chatWithSender = {
        partner: senderId,
        messages: [],
      };
      chatWithSender.messages.push({
        status: "Delivered",
        content: messageContent,
      });
      receiverChats.push(chatWithSender);
    }

    chatWithSender.messages.push({
      status: "Delivered",
      content: messageContent,
    });

    await sender.save();
    await receiver.save();

    console.log("Message sent and received successfully");
    res.json({ senderChats: sender.chats, receiverChats: receiver.chats });
  } catch (error) {
    console.error("Error:", error.message);
    res.json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const senderId = req.user._id.toString();
    const receiverId = req.query.receiverId;
    let senderMessages = [];

    let sender =
      (await patientModel.findById(senderId)) ||
      (await pharmacistModel.findById(senderId)) ||
      (await doctorModel.findById(senderId));
    if (!sender) {
      throw new Error("Sender not found");
    }

    let receiver =
      (await patientModel.findById(receiverId)) ||
      (await pharmacistModel.findById(receiverId)) ||
      (await doctorModel.findById(receiverId));
    if (!receiver) {
      throw new Error("Receiver not found");
    }

    let senderChat = sender.chats.find((chat) => chat.partner === receiverId);
    if (senderChat) {
      senderMessages = senderChat.messages;
      console.log("Messages retrieved successfully");
    }
    res.json({ oldMessages: senderMessages });
  } catch (error) {
    console.error("Error:", error.message);
    res.json({ message: error.message });
  }
};

const patientRetrieveNotifications = async (req, res) => {
  const notifications = await notificationSystemModel.find({
    type: "Patient",
    Id: req.user._id.toString(),
  });
  return res.json(notifications);
};

const rescheduleAppointmentAsPatient = async (req, res) => {
  try {
    const { appointmentId, newDate } = req.body;
    const patientId = req.user._id;
    //const patientId = "65775548b35fbc02783d8d9f";
    const currentDate = new Date();

    const appointment = await appointmentModel
      .findById(appointmentId)
      .populate("doctor");
    if (!appointment) {
      return res.json({ error: "Appointment not found." });
    }

    const newDateTime = new Date(newDate);

    if (newDateTime <= currentDate) {
      return res.json({
        success: false,
        title: "Cant Reschedule",
        message: "Please only select a time slot in the future",
      });
    }

    // Check for availability at the new date and time
    const isAvailable = await checkAppointmentAvailability(
      appointment.doctor._id,
      newDateTime
    );
    //const isAvailable = await checkAppointmentAvailability(appointment.doctorId, newDateTime);

    if (!isAvailable) {
      return res.json({
        success: false,
        title: "Could Not Reserve",
        message:
          "Selected date and time is not available. Please choose another.",
      });
    }

    // Update the appointment date
    appointment.date = newDateTime;
    await appointment.save();

    res.json({ success: true, title: "Appointment Rescheduled" });
  } catch (err) {
    console.log(err);
    res.json({ error: err.message });
  }
};

// Helper function to check appointment availability
const checkAppointmentAvailability = async (doctorId, newDateTime) => {
  const existingAppointment = await appointmentModel.findOne({
    doctor: doctorId,
    date: newDateTime,
    status: "free",
  });

  return !existingAppointment;
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
  payWithCardPackage,
  payWithWallet,
  sendCheckoutMail,
  getAllAddresses,
  cashOnDelivery,
  pastOrders,
  cancelOrder,
  deleteHealthRecord,
  cancelAppointment,
  addPrescriptionToCart,
  getChattingRoom,
  sendMessage,
  getMessages,
  patientRetrieveNotifications,
  payWithWalletCart,
  payWithCardCart,
  getUniqueCode,
  createOrderPending,
  removeOrderPending,
  rescheduleAppointmentAsPatient,
  updateSocketId,
  getSocketId
};
