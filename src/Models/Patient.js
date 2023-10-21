const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    emergencyContact: {
      type: {
        name: String,
        mobile_number: String,
        relation: String,
      },
      required: true,
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
