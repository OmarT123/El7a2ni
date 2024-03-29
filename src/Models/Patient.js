const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema(
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
    gender: {
      type: String,
      required: true,
    },
    uniqueCode: {
      type: String,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    socketId :{
      type: String,
      unique : true,
      default : ""
    },
    emergencyContact: {
      type: {
        name: String,
        mobileNumber: String,
        relation: String,
      },
      required: true,
    },
    familyMembers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "FamilyMember",
      }
    ],
    HealthRecords: [
      { 
        type: String,
      }
    ],
    healthPackage:{
        type: {
        healthPackageID: {
          type : mongoose.Schema.Types.ObjectId,
          ref : 'HealthPackage',
        },
        status: String,
        endDate: Date,
      },
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
,
    cart: { items:[
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
    ] ,
    amountToBePaid: {
      type: Number,
      default: 0
    }
  },
  wallet: {
    type: Number,
    default: 0
  },
  deliveryAddress: [
    {
      type: String // format: street,appartmentNum,city,state,zipcode
    }
  ]
},
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;