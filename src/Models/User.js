const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique : true
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    type : {
      type : String
      
    }
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
