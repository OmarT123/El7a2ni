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

// Add a static method to the schema
appointmentSchema.statics.cancelPastAppointments = async function () {
  try {
    const currentDate = new Date();

    // Find all upcoming appointments with a date in the past
    const appointmentsToUpdate = await this.find({
      date: { $lt: currentDate },
      status: 'upcoming',
    });

    const appointmentsToDelete = await this.find({
      date: { $lt: currentDate },
      status: 'free',
    });

    // Update the status to 'cancelled' for each matching appointment
    for (const appointment of appointmentsToUpdate) {
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
