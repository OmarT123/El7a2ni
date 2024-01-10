const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pharmacistSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique : true
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
    status: {
      type: String,// pending, rejected, accepted
      default: "pending",
  },wallet:{
    type: Number,
    default: 0,
  }

  ,
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

const Pharmacist = mongoose.model("Pharmacist", pharmacistSchema);
module.exports = Pharmacist;
