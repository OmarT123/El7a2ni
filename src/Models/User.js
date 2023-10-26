const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userOptions={
    discriminationKey:'userType',
    collection:'users'
};

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
