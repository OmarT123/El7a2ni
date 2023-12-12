const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const familyMemberSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nationalId: {
      type: String
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    relationToPatient: {
      type: String,
      required: true,
    },
    healthPackage:{
      type: {
        healthPackageID: {
          type : mongoose.Schema.Types.ObjectId,
          ref : 'HealthPackage',
        },
        status: String,
        endDate: Date,
      },
    },
    healthPackageDiscount:{
      type: {
        healthPackageID: {
          type : mongoose.Schema.Types.ObjectId,
          ref : 'HealthPackage',
        },
        discount: Number,
      },
    },
  },
  { timestamps: true }
);

const FamilyMember = mongoose.model("FamilyMember", familyMemberSchema);
module.exports = FamilyMember;
