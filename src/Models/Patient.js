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
    birthdate: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    mobile_number: {
      type: String,
      required: true,
    },
    emergency_contact: {
      type: {
        name: String,
        mobile_number: String,
      },
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
