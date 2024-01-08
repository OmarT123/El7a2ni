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
        medId : {
          type : mongoose.Schema.Types.ObjectId,
          ref : 'Medicine',
          required : true
        },
        dosage : {
          type : Number ,
          required : true
        }

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
    appointment: {
      type: mongoose.Types.ObjectId,
      ref:"Appointment",
    },
    dateFilled: {
      type: Date,
    },
    sentToPharmacy: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;
