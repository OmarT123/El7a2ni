const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorDocumentsSchema = new Schema(
{
    doctor:{
        type: mongoose.Types.ObjectId,
        ref: "Doctor",
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
},
{ timestamps: true }    
);

const DoctorDocuments = mongoose.model("DoctorDocuments", doctorDocumentsSchema);
module.exports = DoctorDocuments;