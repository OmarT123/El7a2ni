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
      type: Date
  },
    status : { // status could be 1. free, 2. upcoming, 3. cancelled, 4. completed
        type: String ,
        default : "upcoming"
    }

  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
