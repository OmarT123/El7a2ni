// VideoChatPatient Component
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Button from "@mui/material/Button";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PhoneIcon from "@mui/icons-material/Phone";
import Peer from "simple-peer";
import io from "socket.io-client";
import "../../VideoChat.css";
import "../../process.js"

const socket = io.connect('http://localhost:4000');

function VideoChatPatient() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [myName, setmyName] = useState("");
  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef(null);

  useEffect(() => {
   const initializeMediaDevices = async () => {
      try {
        // const userMediaStream = await
         navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream)=>{
          setStream(stream)
          if (myVideo.current) {
            myVideo.current.srcObject = stream;
          }
         });
        // setStream(userMediaStream);

        // if (myVideo.current) {
        //   myVideo.current.srcObject = userMediaStream;
        // }

        socket.on("me", async (id) => {
        console.log(id)
        setMe(id);
        await axios.put('/updateSocketId', {socketId : id});

        });


        socket.on("callUser", (data) => {
          setReceivingCall(true);
          setCaller(data.from);
          setmyName(data.name);
          setCallerSignal(data.signal);
        });


      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    initializeMediaDevices();
  }, []);
  const callUser =async (id) => {
   const response= await axios.get('/getSocketId',{params : {userId : id}})
   console.log("socket id to be called :"+response.data)
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
  
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: response.data,
        signalData: data,
        from: me,
        name: myName,
      });
    });
  
    // peer.on("stream", (remoteStream) => {
    //   if (userVideo.current) {
    //     userVideo.current.srcObject = remoteStream;
    //   }
    // });
  
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
  
    connectionRef.current = peer;
  };
  
  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
  
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
  
    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });
  
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };
 const leaveCall = () => {
  setCallEnded(true);

  // Stop remote stream
  if (userVideo.current) {
    userVideo.current.srcObject = null;
  }

  if (connectionRef.current) {
    connectionRef.current.destroy();
  }

  // Inform the server that the call has ended
  socket.emit("callEnded", { to: caller });
};
  
  

  return (
    <>
      <h1 style={{ textAlign: "center", color: "#fff" }}>El7a2ni Rooom Chat</h1>
      <div className="container">
      <div className="video-container">
  <div className="video">
  <h3 style={{ textAlign: "center", color: "#fff" }}>My Camera</h3>
    {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "400px"  }} />}
  </div>
  <div className="video">
  
    {callAccepted && !callEnded ?
      // <h3 style={{ textAlign: "center", color: "#fff" }}>Partner Camera</h3> &&

    <video playsInline ref={userVideo} autoPlay style={{ width: "400px" }} /> : null}
  </div>
</div>

        <div className="myId">
          <TextField
            id="filled-basic"
            label="Name"
            variant="filled"
            value={myName}
            onChange={(e) => setmyName(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          {/* {console.log(me)} */}
          <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
            <Button variant="contained" color="primary" startIcon={<AssignmentIcon fontSize="large" />}>
              Copy ID
            </Button>
          </CopyToClipboard>

          <TextField
            id="filled-basic"
            label="ID to call"
            variant="filled"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
          />
          <div className="call-button">
            {callAccepted && !callEnded ? (
              <Button variant="contained" color="secondary" onClick={leaveCall}>
                End Call
              </Button>
            ) : (
              <IconButton color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
                <PhoneIcon fontSize="large" />
              </IconButton>
            )}
            {idToCall}
          </div>
        </div>
        <div>
          {receivingCall && !callAccepted ? (
            <div className="caller">
              <h1>{myName} is calling...</h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default VideoChatPatient;