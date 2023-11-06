const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medicineSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique : true
    },
    price: {
      type: Number,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
    },
    amountSold: {
      type: Number,
      required: true,
      default: 0,
    },
    medicinalUse: {
      type: String,
      required: true,
    },
    activeIngredient: {
      type: String,
      required: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    picture: {
      type: String,
    },
  },
  { timestamps: true }
);

const Medicine = mongoose.model("Medicine", medicineSchema);
module.exports = Medicine;
