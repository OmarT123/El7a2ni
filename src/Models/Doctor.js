const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique : true
    },
    socketId : {
      type : String,
      unique : true,
      default : ""
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
    affiliation: {
      type: String,
      required: true,
    },
    educationalBackground: {
      type: [String],
      required: true,
    },
    speciality: {
      type: String,
      required: true,
    },
    contract: {
      type: String
    },
    status:{
      type: String,
      default: 'pending'
    },
    chats:[ {

        partner: {
      type : String ,// id od doc or pharmacist
      required: true
      }
      ,
      messages: [
        {
          status: {
            type: String, // 'Received' or 'Sent'
            required: true
          },
          content: {
            type: String,
            required: true
          },
          time: {
            type: Date,
            default: Date.now 
          }
        }
      ]
      }
      ]
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
