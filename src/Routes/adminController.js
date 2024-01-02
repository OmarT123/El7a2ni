const doctorModel = require("../Models/Doctor.js");
const patientModel = require("../Models/Patient.js");
const adminModel = require("../Models/Admin.js");
const healthPackageModel = require("../Models/HealthPackage.js");
const userModel = require("../Models/User.js")
const nodemailer = require("nodemailer")
const bcrypt = require('bcrypt');


const addAdmin = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  try {
    if (!username || !password) {
      return res.json({ success: false, message: "Username and password are required. Please enter valid credentials!" });
    }


    const user = await userModel.findOne({username})
    if (user)
    {
      res.json("Username already exists.")
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
      const encryptedPassword = await bcrypt.hash(password ,salt )
      const admin = await adminModel.create({ username, password :encryptedPassword });
      await admin.save();
     const user =  await userModel.create({
        username, 
        userId : admin._id,
        type : 'admin'
      })
      await user.save();
      res.json("Admin Created Successfully.");
    }
  } catch (err) {
    res.send(err.message);
  }
};

const viewDocInfo = async (req, res) => {
  try {
    const doctors = doctorModel
      .find({ status: "pending" })
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
    const allPatient = await patientModel.find({}).populate({path:'familyMembers'}).populate({path:'healthPackage'}).exec();
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
    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    const doc = await doctorModel.findById(doctorId)
    const doctor = await doctorModel.findByIdAndUpdate(doctorId,{status: "approved", contract:`
    <header className="header-contract">
    <h1>Clinic Services Contract</h1>
    <p>Effective Date: ${currentYear}/${currentMonth}/${currentDay}</p>
  </header>

  <section>
    <h2>Parties</h2>
    <p>This Agreement is entered into between:</p>
    <p><strong>Provider:</strong> El7a2ni</p>
    <p><strong>Client:</strong> ${doc.name}</p>
    <P><strong>Clinic Markup:</strong> ${process.env.CLINIC_MARKUP}</p>
  </section>

  <section>
    <h2>Scope of Services</h2>
    <p>The Provider agrees to provide medical services to the Client, including but not limited to:</p>
    <ul>
      <li>Consultations</li>
      <li>Examinations</li>
      <li>Treatments</li>
      <!-- Add more specific services as needed -->
    </ul>
  </section>

  <section>
    <h2>Terms and Conditions</h2>
    <ol>
      <li>The Client agrees to pay for services rendered based on the agreed-upon fee schedule.</li>
      <li>Any additional services not covered by this agreement will be subject to additional charges.</li>
      <!-- Add more terms and conditions as needed -->
    </ol>
  </section>

  <footer>
    <p>This contract is legally binding upon the parties as of the Effective Date.</p>
    <p>Provider: Omar Abdelaty</p>
    <p>Client: ${doc.name}</p>
  </footer>
    `});

    if (!doctor) {
      return res.json({ message: 'doctor not found' });
    }

    sendMail(doctor, "Application Accepted, please log in to view your contract")
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

    sendMail(doctor, "Application Rejected")

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



const sendMail = async (doctor, message) => {

  const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: doctor.email,
    subject: 'Appliation',
    text: message,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    // console.log('done')
  } catch (error) {
    console.log(error.message)
  }
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
  getHealthPackage,
  getAllPatients,
  getAllAdmins,
  getAllDoctors,
  acceptDoctor,
  rejectDoctor,
  getADoctor,
};
