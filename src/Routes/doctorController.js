const doctorModel = require('../Models/Doctor.js');
const appointmentModel = require('../Models/Appointment.js');

const { default: mongoose } = require("mongoose");

const createAppointment = async(req,res) => {
    try {
        let appointment = await appointmentModel.create({patient:req.body.patient,doctor:req.body.doctor,date:req.body.date,status:req.body.status})
        await appointment.save()
        res.send(appointment);
    }catch(err) {
        res.send(err.message);
    }
}

const filterAppointmentsForDoctor = async (req, res) => {
    // Need login
    const dateToBeFiltered = req.body.date;
    const statusToBeFiltered = req.body.status;
    const filterQuery = {};
  
    if (dateToBeFiltered) {
      filterQuery["date"] = dateToBeFiltered;
    }
  
    if (statusToBeFiltered) {
      filterQuery["status"] = statusToBeFiltered;
    }
    if(req.query.id){
      const id = req.query.id
      filterQuery["doctor"] = new mongoose.Types.ObjectId(id) ;
      try {
        const filteredAppointments = await appointmentModel.find(filterQuery).populate({path:"patient"});
        if (filteredAppointments.length === 0) {
          return res.status(404).json({ error: 'No matching appointments found for the Doctor.' });
        }
        res.json(filteredAppointments);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving appointments.' });
      }
    }else{
      try{
      const filteredAppointments = await appointmentModel.find(filterQuery);
      res.json(filteredAppointments);
      }
      catch(err){
        console.error(err);
        res.status(404).json({ error: 'No matching appointments found for the Doctor.' });
      }
    }
  
   
  }
  



module.exports = {filterAppointmentsForDoctor, createAppointment };
