const pharmacistModel = require("../Models/Pharmacist.js");
const medicineModel = require("../Models/Medicine.js");
const userModel = require("../Models/User.js");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const addMedicine = async (req, res) => {
  let activeIngredient = req.body.activeIngredient;
  let price = req.body.price;
  let stockQuantity = req.body.stockQuantity;
  let medicinalUse = req.body.medicinalUse;
  let name = req.body.name;
  let amountSold = 0;

  try {
    let medicine = await medicineModel.create({
      activeIngredient: activeIngredient,
      price: price,
      stockQuantity: stockQuantity,
      medicinalUse: medicinalUse,
      name: name,
      amountSold: amountSold,
    });
    await medicine.save();
    res.status(200).json({success:true, title: 'Medicine Created Successfully'});
  } catch (err) {
    res.json({success: false, title:"Medicine name already exists"});
  }
};
const searchMedicinePharmacist = async (req, res) => {
  const searchName = req.query.name;
  const searchQuery = new RegExp(searchName, "i"); // 'i' flag makes it case-insensitive
  try {
    const results = await medicineModel.find({ name: searchQuery });
    if (results.length == 0) {
      res.json("Medicine is not Found !!");
    } else {
      res.json(results);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const filterByMedicinalUsePharmacist = async (req, res) => {
  const medUse = req.query.medicinalUse;
  const searchQuery = new RegExp(medUse, "i");
  try {
    const medicine = medicineModel
      .find({ medicinalUse: searchQuery })
      .then((medicine) => res.json(medicine));
  } catch (err) {
    res.json({ message: err.message });
  }
};

const editMedicine = async (req, res) => {
  await medicineModel
    .updateMany({ name: req.body.name }, req.body)
    .then(() =>
      res.json({ success: true, title: "Medicine Updated Successfully!" })
    )
    .catch((err) => res.json({ message: err.message }));
};

const addPharmacist = async (req, res) => {
  let username = req.body.username;
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let birthDate = req.body.birthDate;
  let rate = req.body.hourlyRate;
  let affiliation = req.body.affiliation;
  let educationalBackground = req.body.educationalBackground;
  let idPDF = req.body.idPDF;
  let degreePDF = req.body.degreePDF;
  let licensePDF = req.body.licensePDF;

  try {
    if (
      !username ||
      !password ||
      !name ||
      !birthDate ||
      !rate ||
      !affiliation ||
      !educationalBackground ||
      !email
    ) {
      return res.json({
        success: false,
        title: "Incomplete Data",
        message: "Please fill all fields",
      });
    }

    const user = await userModel.findOne({ username });
    if (user) {
      return res.json({ success: false, title: "Username already exists" });
    }

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

    let pharmacist = await pharmacistModel.create({
      username: username,
      name: name,
      email: email,
      password: encryptedPassword,
      birthDate: birthDate,
      hourlyRate: rate,
      affiliation: affiliation,
      educationalBackground: educationalBackground,
      idPDF: idPDF,
      degreePDF: degreePDF,
      licensePDF: licensePDF,
    });

    await pharmacist.save();

    const userC = await userModel.create({
      username,
      userId: pharmacist._id,
      type: "pharmacist",
    });

    await userC.save();

    res.json({
      success: true,
      title: "Successfully Registered",
      message:
        "We will be back with you in 2-3 working days to verify your application",
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.json({ success: false, message: "Internal Server Error" });
  }
};

const medicinequantityandsales = async (req, res) => {
  try {
    let medicines = await medicineModel.find();
    quantitiesandsales = medicines.map((med) => ({
      name: med.name,
      quantity: med.stockQuantity + " Pieces",
      sales: med.amountSold + " Pieces",
    }));
    res.status(200).json(quantitiesandsales);
  } catch (err) {
    res.json({ message: err.message });
  }
};

const uploadMedicineImage = async (req, res) => {
  const medicineID = req.body.id;
  const imageString = req.body.base64;
  try {
    const updatedMedicine = await medicineModel.findByIdAndUpdate(
      medicineID,
      { $set: { picture: imageString } },
      res.json("Image uploaded successfully.")
    );
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addPharmacist,
  searchMedicinePharmacist,
  editMedicine,
  addMedicine,
  medicinequantityandsales,
  filterByMedicinalUsePharmacist,
  uploadMedicineImage,
};
