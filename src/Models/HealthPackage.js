const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const healthPackageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    doctorDiscount: {
      type: Number,
      required: true,
    },
    medicineDiscount: {
      type: Number,
      required: true,
    },
    familyDiscount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const HealthPackage = mongoose.model("HealthPackage", healthPackageSchema);
module.exports = HealthPackage;
