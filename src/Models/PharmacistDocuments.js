const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pharmacistDocumentsSchema = new Schema(
{
    pharmacist:{
        type: mongoose.Types.ObjectId,
        ref: "Pharmacist",
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

const PharmacistDocuments = mongoose.model("PharmacistDocuments", pharmacistDocumentsSchema);
module.exports = PharmacistDocuments;