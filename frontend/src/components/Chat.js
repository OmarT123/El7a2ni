import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios"
import { Collapse } from "@mui/material";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import io from "socket.io-client";
import "../index.css";
const socket = io.connect("http://localhost:4000");

function Chat({ partner, name, setChat }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [room, setRoom] = useState("");
  const [collapse, setCollapse] = useState(true);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: partner,
        content: currentMessage,
        time:new Date().toLocaleString(),
      };
   

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      await axios.post('/sendMessage',{
        messageContent: messageData.content,
        receiverId: messageData.author
      });
      setCurrentMessage(""); 
      console.log([...messageList, messageData])
      
    }

  };

  const handleCollapse = () => {
    setCollapse(!collapse);
  };

  useEffect(() => {


  const joinRoom = async () => {
    if (partner !== "") {
      const response =  await axios.get('/getChattingRoom', { params: {partner:partner} });
      const data=response.data;
      setRoom(data._id)
      socket.emit("join_room", data._id);
    };
    }
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/getMessages', { params: { receiverId: partner } });
        const senderMessages = response.data.oldMessages;
        console.log(senderMessages)
        setMessageList(senderMessages);
  
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    joinRoom();
    fetchMessages(); 




    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket,partner]);

  return (
    <div className="chat-window" style={{ position: "fixed", bottom: 16, right: 16 }}>
      {collapse && <div className="chat-header">
        <p onClick={handleCollapse}> {name} {!collapse && <ChatBubbleIcon sx={{height:'15px'}}/>}{collapse && <ChatIcon sx={{height:'15px'}}/>}{<CloseIcon sx={{height:'15px', marginLeft:'150px'}} onClick={() => setChat(false)}/>}</p>
      </div>}
      {!collapse && <div className="chat-header" style={{ position: "fixed", bottom: 16, right: 16 }}>
        <p onClick={handleCollapse}> {name} {!collapse && <ChatBubbleIcon sx={{height:'15px'}}/>}{collapse && <ChatIcon sx={{height:'15px'}}/>}{<CloseIcon sx={{height:'15px', marginLeft:'168px'}} onClick={() => setChat(false)}/>}</p>
      </div>}
      <Collapse in={collapse} timeout='0'>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((message) => {
            return (
              <div
                className="message"
                id={ 
                  partner === message.author ||
                    message.status === 'Sent' ? "other" : "you"}
              >
                <div>
                  <div className="message-content">
                    <p>{message.content}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{message.time.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
      </Collapse>
    </div>
    
  );
}

export default Chat;