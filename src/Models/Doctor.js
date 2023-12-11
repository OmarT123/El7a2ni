const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique : true
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
    hourlyRate: {
      type: Number,
      required: true,
    },
    affiliation: {
      type: String,
      required: true,
    },
    educationalBackground: {
      type: [String],
      required: true,
    },
    pendingApproval: {
      type: Boolean,
      default: true,
    },
    speciality: {
      type: String,
      required: true,
    },
    idPDF: {
      type: String,
    },
    degreePDF: {
      type: String,
    },
    licensePDF: {
      type: String,
    },
    wallet:{
      type:Number
    }
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
