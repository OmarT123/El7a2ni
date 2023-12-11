const doctorModel = require("../Models/Doctor.js");
const patientModel = require("../Models/Patient.js");
const adminModel = require("../Models/Admin.js");
const healthPackageModel = require("../Models/HealthPackage.js");
const userModel = require("../Models/User.js")


const addAdmin = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  try {
    const user = await userModel.findOne({username})
    console.log(user)
    if (user)
    {
      res.json("Username already exists")
    }
    else {
      console.log("no here")
      const admin = await adminModel.create({ username, password });
      await admin.save();
      await userModel.create({
        username, 
        userId : admin._id
      })
      res.json("Admin Created Successfully !!");
    }
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

const getADoctor = async (req,res) => {
  const doctorId = req.query.id
  try {
    const doctor = await doctorModel.findById(doctorId)
    // console.log(doctor)
    res.json(doctor)
  }catch(err)
    {res.json(err.message)}
}

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

const getAllPatients = async (req,res) => {

  try {
    const allPatient = await patientModel.find({}).populate({path:'familyMembers'}).exec();
    res.json(allPatient);
  }
  catch(error){
    res.status(500).json({ error: error.message });

  }
}
const getAllDoctors = async (req,res) => {

  try {
    const allDoctors = await doctorModel.find({});
    res.json(allDoctors);
  }
  catch(error){
    res.status(500).json({ error: error.message });

  }
}

const getAllAdmins = async (req,res) => {

  try {
    const allAdmins = await adminModel.find({});
    res.json(allAdmins);
  }
  catch(error){
    res.status(500).json({ error: error.message });

  }
}

const acceptDoctor = async (req, res) => {
  const { doctorId } = req.query;

  try {
    const doctor = await doctorModel.findById(doctorId);

    if (!doctor) {
      return res.json({ message: 'doctor not found' });
    }


    doctor.status = "approved";


    await doctor.save();

    return res.status(200).json({
      message: 'doctor request accepted successfully',
      doctor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


const rejectDoctor = async (req, res) => {
  const { doctorId } = req.query;

  try {
    const doctor = await doctorModel.findById(doctorId);

    if (!doctor) {
      return res.json({ message: 'doctor not found' });
    }


    doctor.status = "rejected";


    await doctor.save();

    return res.status(200).json({
      message: 'doctor request rejected successfully',
      doctor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
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
  addAdmin,
  getAllHealthPackages,
  getHealthPackage,
  getAllPatients,
  getAllAdmins,
  getAllDoctors,
  acceptDoctor,
  rejectDoctor,
  getADoctor
};
