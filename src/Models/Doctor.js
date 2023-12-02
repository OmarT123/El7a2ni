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
    status: { //status can be: 1. pending (admin approval), 2. contract (to be accepted by the doctor), 3. approved (registered & contract approved)
      type: String,
      default: "pending",
    },
    speciality: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
