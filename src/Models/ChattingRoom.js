const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChattingRoomSchema = new Schema(
  {
    partner1Id: {
      type: String,
      required: true,
    },
    partner2Id: {
      type: String,
      required: true,
    }

      }
      ,
  { timestamps: true }
);

const ChattingRoom = mongoose.model("ChattingRoom", ChattingRoomSchema);
module.exports = ChattingRoom;