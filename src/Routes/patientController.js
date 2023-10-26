const familyModel = require("../Models/FamilyMember.js");
const { default: mongoose } = require("mongoose");

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
    )
      throw "Relation to Patient should be wife/husband/son/daughter";
    let familyMember = await familyModel.create({
      name,
      nationalId,
      age,
      gender,
      relationToPatient,
      patient: patientId,
    });
    await familyMember.save();
    res.send(familyMember);
  } catch (err) {
    res.send(err);
  }
};

module.exports = { createFamilyMember };
