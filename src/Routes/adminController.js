const doctorModel = require("../Models/Doctor.js");
const patientModel = require("../Models/Patient.js");
const adminModel = require("../Models/Admin.js");
const healthPackageModel = require("../Models/HealthPackage.js");


const addAdmin = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  try {
    const admin = await adminModel.create({ username, password });
    await admin.save();
    res.json("Admin Created Successfully !!");
  } catch (err) {
    res.send(err.message);
  }
};

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
    res.json("Updated Successully");
  } catch (err) {
    res.json(err.message);
  }
};

const deleteHealthPackage = async (req, res) => {
  let id = req.query.id;
  try {
    await healthPackageModel.findByIdAndDelete(id);
    res.json("Deleted Successfully");
  } catch (err) {
    res.json(err.message);
  }
};
const deletePatient = async (req, res) => {
  const patientId = req.query.id; 
  try {
    await patientModel.findByIdAndDelete(patientId);
    res.status(200).json({ message: 'Patient deleted successfully from the Database' });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
const deleteDoctor = async (req, res) => {
  const doctorId = req.query.id; 
  try {
    await doctorModel.findByIdAndDelete(doctorId);
    res.status(200).json({ message: 'Doctor deleted successfully from the Database' });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
const deleteAdmin = async (req, res) => {
  const adminId = req.query.id; 
  try {
     await adminModel.findByIdAndDelete(adminId);
    res.status(200).json({ message: 'admin deleted successfully from the Database' });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
const getAllHealthPackages = async (req,res) => {
  try{
    const packages = await healthPackageModel.find()
    res.json(packages)
  }
  catch(err){
    res.json(err.message)
  }
}

const getHealthPackage = async (req,res) => {
  try {
    const id = req.query.id
    const hpackage = await healthPackageModel.findById(id)
    res.json(hpackage)

  }catch(err)
  {res.json(err.message)}
}


module.exports = {
  addHealthPackage,
  editHealthPackage,
  viewDocInfo,
  deleteHealthPackage,
  deletePatient,
  deleteDoctor,
  deleteAdmin,
  addAdmin,
  getAllHealthPackages,
  getHealthPackage
};
