const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const healthRecordsSchema = new Schema(
{
    patient:{
        type: mongoose.Types.ObjectId,
        ref: "Patient",
    },

    HealthRecords: {
        type: [String],
        default: [],
      },

},
{ timestamps: true }    
);

const HealthRecords = mongoose.model("HealthRecords", healthRecordsSchema);
module.exports = HealthRecords;