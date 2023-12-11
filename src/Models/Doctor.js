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
    wallet:{
      type:Number
    },
    status:{
      type: String,
      default:"pending"
    },
    idPDF: {
      type: String,
      required: true,
    },
    licensePDF: {
      type: String,
      required: true,
    },
    degreePDF: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
