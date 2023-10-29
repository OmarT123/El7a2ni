const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema(
  {
    doctor: {
        
       type: mongoose.Types.ObjectId,
       ref: "Doctor",
    },
    patient: {
        type: mongoose.Types.ObjectId,
        ref: "Patient",
    },    date : { 
      type: Date,
      required : true
  },
    status : {
        type: String , 
        default : "upcoming"
    }

  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;