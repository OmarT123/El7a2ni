const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    address: {
        type: String,
        required: true
    },
    items: [
        {
            medicine: {
                type: mongoose.Types.ObjectId,
                ref: 'Medicine'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    paymentMethod:
    {
        type: String,
        required: true
    },
    status:
    {   
        type: String,
        required: true
    },

    patient: {
        type: mongoose.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    First_Name: {
        type: String,
        required: true
    },
    Last_Name: {
        type: String,
        required: true
    },
    discount:{
        type: Number,
        default:0
    }
},
    { timestamps: true }
  
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;