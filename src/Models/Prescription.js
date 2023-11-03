const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema(
  {
    filled: {
      type: Boolean,
      default:false,
    },
    medicines: [
      {
        type: {medId:mongoose.Types.ObjectId, dosage:Number},
        ref:"Medicine",
        required: true,
      },
    ],
    patient: {
      type: mongoose.Types.ObjectId,
      ref:"Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Types.ObjectId,
      ref:"Doctor",
      required: true,
    },
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;
