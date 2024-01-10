const doctorModel = require("../Models/Doctor.js");
const patientModel = require("../Models/Patient.js");
const appointmentModel = require("../Models/Appointment.js");
const adminModel = require("../Models/Admin.js");
const prescriptionModel = require("../Models/Prescription.js");
const medicineModel = require("../Models/Medicine.js");
const userModel = require("../Models/User.js");
const healthPackageModel = require("../Models/HealthPackage.js");
const doctorDocuments = require("../Models/DoctorDocuments.js");
const familyMemberModel = require("../Models/FamilyMember.js");
const FamilyMemberModel = require("../Models/FamilyMember.js");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const createPrescription = async (req, res) => {
  try {
    let prescription = await prescriptionModel.create({
      filled: req.body.filled,
      patient: req.body.patient,
      doctor: req.body.doctor,
      medicines: req.body.medicines,
    });
    await prescription.save();
    res.send(prescription);
  } catch (err) {
    res.send(err.message);
  }
};
//add/update dosage for each medicine added to the prescription
const addDosage = async (req, res) => {
  try {
    let prescriptionId = req.body.prescriptionId;
    let prescription = await prescriptionModel.findById(prescriptionId);
    if (prescription) {
      let medicineId = req.body.medicineId;
      let dosage = req.body.dosage;
      for (const medicine of prescription.medicines) {
        if (medicine.medId.toString() === medicineId) {
          medicine.dosage = dosage;
          await prescription.save();
          return res.json({ success: true, prescription });
        }
      }
      res.json({ success: false, title: "Medicine Not Found" });
    } else {
      res.json({ success: false, title: "Prescription Not Found" });
    }
  } catch (err) {
    res.json(err.message);
  }
};

const filterAppointmentsForDoctor = async (req, res) => {
  // Need login
  const dateToBeFiltered = req.query.date;
  const statusToBeFiltered = req.query.status;
  const searchQuery = new RegExp(statusToBeFiltered, "i"); // 'i' flag makes it case-insensitive

  const filterQuery = {};

  if (dateToBeFiltered) {
    const dateParam = req.query.date;
    const startDate = new Date(dateParam);
    const endDate = new Date(dateParam);
    endDate.setDate(endDate.getDate() + 1);
    filterQuery["date"] = { $gte: startDate, $lt: endDate };
  }

  if (searchQuery) {
    filterQuery["status"] = searchQuery;
  }
  const id = req.user._id;
  filterQuery["doctor"] = id;
  try {
    const filteredAppointments = await appointmentModel
      .find(filterQuery)
      .populate({ path: "patient" });
    if (filteredAppointments.length === 0) {
      return res.json({
        success: false,
        title: "No Appointments Found",
        message: "Change the search filter to view more results",
      });
    }
    const currentDate = new Date();
    let upcomingAppointments = [];
    let cancelledAppointments = [];
    let freeAppointments = [];
    let completedAppointments = [];
    let requestedAppointments = [];
    for (appointment of filteredAppointments) {
      if (appointment.status === "upcoming")
        upcomingAppointments.push(appointment);
      else if (appointment.status === "cancelled")
        cancelledAppointments.push(appointment);
      else if (appointment.status === "free")
        freeAppointments.push(appointment);
      else if (appointment.status === "completed")
        completedAppointments.push(appointment);
      else requestedAppointments.push(appointment);
    }
    const appointmentData = {
      upcomingAppointments,
      cancelledAppointments,
      freeAppointments,
      completedAppointments,
      requestedAppointments,
    };
    res.json({ success: true, appointmentData });
  } catch (err) {
    console.error(err);
    res.json({ error: "An error occurred while retrieving appointments." });
  }
};

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
    idPDF,
    degreePDF,
    licensePDF,
  } = req.body;
  try {
    if (
      !username ||
      !password ||
      !name ||
      !birthDate ||
      !hourlyRate ||
      !affiliation ||
      !educationalBackground ||
      !speciality ||
      !email
    ) {
      return res.json({
        success: false,
        message:
          "All fields are required. Please provide valid information for each field!",
      });
    }

    const user = await userModel.findOne({ username });
    if (user) {
      res.json({ success: false, title: "Username already exists" });
    } else {
      const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%^&*()?[\]{}|<>])[A-Za-z\d@$!%^&*()?[\]{}|<>]{10,}$/;
      if (!passwordRegex.test(password)) {
        return res.json({
          success: false,
          title: "Invalid Password",
          message:
            "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character, and be at least 10 characters long.",
        });
      }
      const salt = await bcrypt.genSalt();
      const encryptedPassword = await bcrypt.hash(password, salt);
      const doctor = await doctorModel.create({
        username,
        name,
        email,
        password: encryptedPassword,
        birthDate,
        hourlyRate,
        affiliation,
        educationalBackground,
        speciality,
      });
      await doctor.save();
      const userC = await userModel.create({
        username,
        userId: doctor._id,
        type: "doctor",
      });
      await userC.save();
      const newDocuments = await doctorDocuments.create({
        doctor: doctor._id,
        idPDF,
        degreePDF,
        licensePDF,
      });
      await newDocuments.save();
      res.json({ success: true, title: "Applied Successfully" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

const editDoctor = async (req, res) => {
  let id = req.user._id;
  let { email, hourlyRate, affiliation } = req.body;
  try {
    let updatedDoctor = await doctorModel.findByIdAndUpdate(
      id,
      {
        email,
        hourlyRate,
        affiliation,
      },
      { new: true }
    );
    res.json({ success: true, title: "Details updated successfully" });
  } catch (err) {
    res.send(err.message);
  }
};

const myPatients = async (req, res) => {
  let doctorID = req.user._id;
  try {
    const appointments = await appointmentModel
      .find({ doctor: doctorID })
      .populate({ path: "patient" })
      .exec();
    const uniquePatientsSet = new Set();
    appointments.forEach((appointment) => {
      if (appointment.patient) {
        uniquePatientsSet.add(appointment.patient._id.toString());
      }
    });

    // Convert Set back to an array of unique patient IDs
    const uniquePatientsArray = Array.from(uniquePatientsSet);
    // Fetch patient details from database based on unique patient IDs
    const PatientsDetails = await patientModel.find({
      _id: { $in: uniquePatientsArray },
    });

    let memberId;
    let memberArray = [];
    for (let i = 0; i < PatientsDetails.length; i++) {
      for (let j = 0; j < PatientsDetails[i].familyMembers.length; j++) {
        memberId = PatientsDetails[i].familyMembers[j].toString();
        let member = await FamilyMemberModel.findById(memberId);
        memberArray[j] = member;
      }
      PatientsDetails[i].familyMembers = memberArray;
      memberArray = [];
    }

    res.json({ success: true, PatientsDetails });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const viewPatient = async (req, res) => {
  try {
    let patientID = new mongoose.Types.ObjectId(req.query.id);
    const patient = await patientModel
      .findById(patientID)
      .populate({ path: "healthPackage" });
    const packageID = patient.healthPackage.healthPackageID;
    const healthPackage = await healthPackageModel.findById(packageID);
    console.log(healthPackage);
    const extendedPatient = {
      ...patient.toObject(),
      healthPackage,
    };
    if (extendedPatient) {
      res.json(extendedPatient);
    } else {
      res.json("");
    }
  } catch (err) {
    res.json(err.message);
  }
};

const exactPatients = async (req, res) => {
  try {
    let id = req.user._id;
    // console.log('here')
    const { name } = req.query;
    // console.log(name)
    const searchName = new RegExp(name, "i");

    let allMyAppointments = await appointmentModel
      .find({ doctor: id })
      .populate({ path: "patient" });
    let patients = allMyAppointments.map((appointment) => appointment.patient);

    let uniquePatientsSet = new Set();
    let filteredPatients = patients.filter((patient) => {
      if (
        patient &&
        searchName.test(patient.name) &&
        !uniquePatientsSet.has(patient._id)
      ) {
        uniquePatientsSet.add(patient._id);
        return true;
      }
      return false;
    });

    res.json({ success: true, filteredPatients });
  } catch (err) {
    res.send(err.message);
  }
};

const filterPatientsByAppointments = async (req, res) => {
  let doctorID = req.user._id;
  try {
    const appointments = await appointmentModel
      .find({ doctor: doctorID })
      .populate({ path: "patient" })
      .exec();
    const uniquePatientsSet = new Set();
    appointments.forEach((appointment) => {
      if (
        (appointment.status === "upcoming" ||
          appointment.status === "requested") &&
        appointment.patient !== null
      ) {
        uniquePatientsSet.add(appointment.patient._id.toString());
      }
    });

    // Convert Set back to an array of unique patient IDs
    const uniquePatientsArray = Array.from(uniquePatientsSet);
    // Fetch patient details from database based on unique patient IDs
    const PatientsDetails = await patientModel.find({
      _id: { $in: uniquePatientsArray },
    });

    let memberId;
    let memberArray = [];
    for (let i = 0; i < PatientsDetails.length; i++) {
      for (let j = 0; j < PatientsDetails[i].familyMembers.length; j++) {
        memberId = PatientsDetails[i].familyMembers[j].toString();
        let member = await FamilyMemberModel.findById(memberId);
        memberArray[j] = member;
      }
      PatientsDetails[i].familyMembers = memberArray;
      memberArray = [];
    }

    res.json({ success: true, PatientsDetails });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const ViewDoctorWallet = async (req, res) => {
  try {
    const DoctorId = req.user._id;
    const Doctor = await doctorModel.findById(DoctorId);

    if (!Doctor) {
      console.log("Doctor not found");
      return;
    }
    const wallet = Doctor.wallet;
    res.json(wallet);
  } catch (err) {
    res.json(err.message);
  }
};

const viewDoctorAppointments = async (req, res) => {
  try {
    const doctorID = req.user._id;

    const upcomingAppointments = await appointmentModel
      .find({
        doctor: doctorID,
        status: "upcoming",
      })
      .populate({ path: "patient" });

    const pastAppointments = await appointmentModel
      .find({
        doctor: doctorID,
        status: "cancelled",
      })
      .populate({ path: "patient" });

    const freeAppointments = await appointmentModel
      .find({
        doctor: doctorID,
        status: "free",
      })
      .populate({ path: "patient" });

    const completedAppointments = await appointmentModel
      .find({
        doctor: doctorID,
        status: "completed",
      })
      .populate({ path: "patient" });

    const requestedAppointments = await appointmentModel
      .find({
        doctor: doctorID,
        status: "requested",
      })
      .populate({ path: "patient" });

    const appointmentData = {
      upcomingAppointments,
      pastAppointments,
      freeAppointments,
      completedAppointments,
      requestedAppointments,
    };

    res.status(200).json(appointmentData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addAppointmentSlots = async (req, res) => {
  try {
    const doctorID = req.user._id;
    const doctor = await doctorModel.findById(doctorID);
    if (doctor.status === "accepted") {
      const combinedDateTimeString = `${req.body.date}T${req.body.time}`;
      const date = new Date(combinedDateTimeString);
      const minTime = new Date(date.getTime() - 60 * 60 * 1000);
      const maxTime = new Date(date.getTime() + 60 * 60 * 1000);
      const existingAppointment = await appointmentModel.findOne({
        doctor: doctor._id,
        date: { $gt: minTime, $lt: maxTime },
      });
      if (req.body.patientID) {
        const clinicMarkup = process.env.CLINIC_MARKUP;
        let discount = 1;
        const patient = await patientModel.findById(req.body.patientID);
        if (patient.healthPackage) {
          const healthPackageID =
            patient.healthPackage.healthPackageID.toString();
          const healthPackage = await healthPackageModel
            .findById(healthPackageID)
            .catch((err) => console.log(err.message));
          discount = 1 - healthPackage.doctorDiscount / 100;
        }
        // console.log(doctor.hourlyRate);
        const appointment = await appointmentModel.create({
          doctor: doctor._id,
          date,
          status: "upcoming",
          patient: new mongoose.Types.ObjectId(req.body.patientID),
          price: (doctor.hourlyRate + (10 / 100) * clinicMarkup) * discount,
          attendantName: patient.name,
        });
        await prescriptionModel.create({
          doctor: doctor._id,
          patient: new mongoose.Types.ObjectId(req.body.patientID),
          appointment: appointment._id,
        });
      } else {
        await appointmentModel.create({
          doctor: doctor._id,
          date,
          status: "free",
        });
      }
      res.json({ succes: true, title: "Appointment Created Successfully" });
    } else res.json("Please review your employment contract.");
  } catch (error) {
    res.json({ message: error.message });
  }
};

const createAppointment = async (req, res) => {
  try {
    let appointment = await appointmentModel.create({
      patient: req.body.patient,
      doctor: req.body.doctor,
      date: req.body.date,
      status: req.body.status,
    });
    await appointment.save();
    res.send(appointment);
  } catch (err) {
    res.send(err.message);
  }
};
const acceptContract = async (req, res) => {
  try {
    let doctorId = req.user._id;
    await doctorModel.findByIdAndUpdate(doctorId, { status: "accepted" });
    res.json({
      success: true,
      title: "Contract Accepted",
      message: "Welcome to El7a2ny",
    });
  } catch (err) {
    res.json(err.message);
  }
};
const rejectContract = async (req, res) => {
  try {
    let doctorId = req.user._id;
    await doctorModel.findByIdAndUpdate(doctorId, { status: "rejected" });
    res.json({
      success: true,
      title: "Contract Rejected",
      message: "Sorry to see you go",
    });
  } catch (err) {
    res.json(err.message);
  }
};
const viewPatientPrescriptions = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const id = req.query.id;
    const prescriptions = await prescriptionModel
      .find({ doctor: doctorId, patient: id })
      .populate({ path: "medicines.medId" })
      .populate({ path: "patient" })
      .exec();
    if (prescriptions.length > 0)
      return res.json({ success: true, prescriptions });
    res.json({ success: false });
  } catch (err) {
    res.json(err.message);
  }
};
const selectPrescriptionDoctor = async (req, res) => {
  try {
    const prescriptionId = req.query.id;
    const prescription = await prescriptionModel
      .findById(prescriptionId)
      .populate({ path: "medicines.medId" })
      .populate({ path: "patient" })
      .exec();
    res.json(prescription);
  } catch (error) {
    res.json({ error: error.message });
  }
};
const addToPrescription = async (req, res) => {
  try {
    const { prescriptionId, medId, dosage } = req.body;
    if (dosage <= 0)
      return res.json({ success: false, title: "Dosage Cant be Below 0" });
    const prescription = await prescriptionModel.findById(prescriptionId);
    let done = false;
    for (const medicine of prescription.medicines) {
      if (medicine.medId.toString() === medId) {
        medicine.dosage += parseInt(dosage);
        done = true;
      }
    }
    if (!done) prescription.medicines.push({ medId, dosage });
    if (prescription.filled === false) {
      prescription.filled = true;
      prescription.dateFilled = new Date();
    }
    await prescription.save();

    res.json({ success: true, title: "Medicine Added Successfully" });
  } catch (error) {
    console.error(error);
    res.json({ error: "Internal Server Error" });
  }
};
const viewAllMedicines = async (req, res) => {
  try {
    const medicines = await medicineModel.find();
    res.json(medicines);
  } catch (error) {
    console.error("Error fetching medicines:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteFromPrescription = async (req, res) => {
  try {
    const { prescriptionId, medId } = req.body;
    const prescription = await prescriptionModel.findById(prescriptionId);
    const medicineIndex = prescription.medicines.findIndex(
      (medicine) => medicine.medId.toString() === medId
    );

    if (medicineIndex !== -1) {
      prescription.medicines.splice(medicineIndex, 1);

      await prescription.save();

      res.json({ success: true, title: "Medicine Deleted From Prescription" });
    } else {
      res.json({ success: false, error: "Medicine not found in prescription" });
    }
  } catch (error) {
    console.error(error);
    res.json({ error: "Internal Server Error" });
  }
};
const approveRequest = async (req, res) => {
  try {
    const appointmentID = req.body.appointmentID;
    const appointment = await appointmentModel.findById(appointmentID);
    appointment.status = "upcoming";
    await appointment.save();

    return res.json({ success: true, title: "Request approved successfully." });
  } catch (error) {
    return res.json();
  }
};
const doctorRetrieveNotifications = async (req, res) => {
  const notifications = await notificationSystemModel.find({
    type: "Doctor",
    Id: req.user._id.toString(),
  });
  return res.json(notifications);
};

const rescheduleAppointmentForPatient = async (req, res) => {
  const doctorID = req.user._id;
  //const doctorID = "65496e4a5c31c981636dc271";
  const { appointmentId, newDate } = req.body;
  // console.log(req.body)
  const currentDate = new Date();

  try {
    // Check if the appointment exists and belongs to the doctor
    const appointment = await appointmentModel.findOne({
      _id: appointmentId,
      doctor: doctorID,
    });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const newDateTime = new Date(newDate);
    if (newDateTime < currentDate) {
      return res.status(400).json({
        error: "Invalid reschedule date. Please choose a future date.",
      });
    }

    // Check if new date is available
    const conflictingAppointment = await appointmentModel.findOne({
      doctor: doctorID,
      date: newDate,
      _id: { $ne: appointmentId },
    });

    if (conflictingAppointment) {
      return res
        .status(400)
        .json({ message: "The new date and time are not available" });
    }

    if (appointment.status == "upcoming") {
      // Update the appointment date
      appointment.date = newDate;
      await appointment.save();

      res.json({ title: "Appointment rescheduled successfully", appointment });
    } else {
      res.status(400).json({ message: "Appointment's Status is not Upcoming" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addDoctor,
  editDoctor,
  filterAppointmentsForDoctor,
  createAppointment,
  myPatients,
  filterPatientsByAppointments,
  viewPatient,
  createPrescription,
  exactPatients,
  addAppointmentSlots,
  ViewDoctorWallet,
  viewDoctorAppointments,
  acceptContract,
  rejectContract,
  viewPatientPrescriptions,
  selectPrescriptionDoctor,
  addDosage,
  addToPrescription,
  viewAllMedicines,
  deleteFromPrescription,
  approveRequest,
  doctorRetrieveNotifications,
  rescheduleAppointmentForPatient,
};
