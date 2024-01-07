const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const prescriptionModel = require("./Prescription");

const appointmentSchema = new Schema(
  {
    doctor: {
        
       type: mongoose.Types.ObjectId,
       ref: "Doctor",
    },
    patient: {
        type: mongoose.Types.ObjectId,
        ref: "Patient",
    },    
    date : { 
      type: Date
    },
    status : { // status could be 1. free, 2. upcoming, 3. cancelled, 4. completed
        type: String ,
        default : "upcoming"
    },
    attendantName : {
      type: String,
    },
    price : {
      type: Number,
    }
  },
  { timestamps: true }
);

// This method cancels any appointments that were upcoming and were not completed by their arrival date, as well as deletes free slots at their date
// The method now also deletes the respective prescription when an appointment is cancelled. (Keep in mind free appointments don't have prescriptions)
appointmentSchema.statics.cancelPastAppointments = async function () {
  try {
    const currentDate = new Date();

    const appointmentsToUpdate = await this.find({
      date: { $lt: currentDate },
      status: 'upcoming',
    });

    const appointmentsToDelete = await this.find({
      date: { $lt: currentDate },
      status: 'free',
    });

    for (const appointment of appointmentsToUpdate) {
      await prescriptionModel.findOneAndDelete({appointment: appointment._id})
      appointment.status = 'cancelled';
      await appointment.save();
    }

    for (const appointment of appointmentsToDelete) {
      await appointment.deleteOne();
    }

    console.log(`Updated ${appointmentsToUpdate.length} appointments to 'cancelled'.`);
    console.log(`Deleted ${appointmentsToDelete.length} appointment slots.`);
  } catch (error) {
    console.error('Error updating appointments:', error);
  }
};

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
