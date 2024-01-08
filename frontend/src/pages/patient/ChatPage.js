
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import axios from 'axios';

const socket = io.connect("http://localhost:4000");

function ChatPage() {
  const [partner, setPartner] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);


  const joinRoom = async () => {
    if (partner !== "") {
      const response =  await axios.get('/getChattingRoom', { params: {partner:partner} });
      const data=response.data;
      setRoom(data._id)
      console.log(data._id)
      socket.emit("join_room", data._id);
      console.log(socket)
      setShowChat(true);
    }
  };

  return (
    <div className="ChatPage">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="partner id..."
            onChange={(event) => {
              setPartner(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Start a chat</button>
        </div>
      ) : (
        <Chat socket={socket} partner={partner} room={room} />
      )}
    </div>
  );
}

export default ChatPage;