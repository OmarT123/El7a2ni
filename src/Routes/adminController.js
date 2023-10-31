const doctorModel = require("../Models/Doctor.js");
const patientModel = require("../Models/Patient.js");
const adminModel = require("../Models/Admin.js");
const healthPackageModel = require("../Models/HealthPackage.js");

const viewDocInfo = async (req, res) => {
  try {
    const doctors = doctorModel
      .find({ pendingApproval: true })
      .populate()
      .then((doctors) => res.json(doctors));
  } catch (err) {
    res.json({ message: err.message });
  }
};

const addHealthPackage = async (req, res) => {
  let { name, price, doctorDiscount, medicineDiscount, familyDiscount } =
    req.body;
  try {
    let healthPackage = await healthPackageModel.create({
      name,
      price,
      doctorDiscount,
      medicineDiscount,
      familyDiscount,
    });
    await healthPackage.save();
    res.send(healthPackage);
  } catch (err) {
    res.send(err);
  }
};

const editHealthPackage = async (req, res) => {
  let id = req.query.id;
  let { price, doctorDiscount, medicineDiscount, familyDiscount } = req.body;
  try {
    let updatedHealthPackage = await healthPackageModel.findByIdAndUpdate(
      id,
      {
        price,
        doctorDiscount,
        medicineDiscount,
        familyDiscount,
      },
      { new: true }
    );
    res.send(updatedHealthPackage);
  } catch (err) {
    res.send(err);
  }
};

const deleteHealthPackage = async (req, res) => {
  let id = req.query.id;
  try {
    await healthPackageModel.findByIdAndDelete(id);
    res.send("Deleted Successfully");
  } catch (err) {
    res.send(err);
  }
};
const deletePatient = async (req, res) => {
  const patientid = req.query.id; 
  try {
    const deletedPatient = await patientModel.findByIdAndDelete(patientid);
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(200).json({ message: err.message });
  }
};
const deleteDoctor = async (req, res) => {
  const doctorid = req.query.id; 
  try {
    const deletedDoctor = await doctorModel.findByIdAndDelete(doctorid);
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(200).json({ message: err.message });
  }
};
const deleteAdmin = async (req, res) => {
  const adminid = req.query.id; 
  try {
    const deletedAdmin = await adminModel.findByIdAndDelete(adminid);
    res.status(200).json({ message: 'admin deleted successfully' });
  } catch (err) {
    res.status(200).json({ message: err.message });
  }
};



module.exports = {
  addHealthPackage,
  editHealthPackage,
  viewDocInfo,
  deleteHealthPackage,
  deletePatient,
  deleteDoctor,
  deleteAdmin,
  

};
