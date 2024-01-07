import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios"

function Chat({ socket, partner, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

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

  useEffect(() => {


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

    fetchMessages(); 




    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p> live Chat</p>
      </div>
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
    </div>
  );
}

export default Chat;