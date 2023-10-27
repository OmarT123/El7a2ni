const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const healthPackageSchema = new Schema(
  {
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
