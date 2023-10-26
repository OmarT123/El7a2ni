const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const familyMemberSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nationalId: {
      type: String,
      unique: true,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    relationToPatient: {
      type: String,
      required: true,
    },
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
  },
  { timestamps: true }
);

const FamilyMember = mongoose.model("FamilyMember", familyMemberSchema);
module.exports = FamilyMember;
