const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoChatRoomSchema = new Schema(
  {

    
 
    patientId: {
      type: String,
      required: true,
    },
    doctorId : {
        type: String,
        required : true
      
    }
  }
);

const VideoChatRoom = mongoose.model("VideoChatRoom", videoChatRoomSchema);
module.exports = VideoChatRoom;
