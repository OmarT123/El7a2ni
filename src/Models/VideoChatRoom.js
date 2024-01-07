const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoChatRoomSchema = new Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique : true
    },
    patientId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    doctorId : {
        type: mongoose.Types.ObjectId,
        required : true
      
    }
  }
);

const VideoChatRoom = mongoose.model("VideoChatRoom", videoChatRoomSchema);
module.exports = VideoChatRoom;
