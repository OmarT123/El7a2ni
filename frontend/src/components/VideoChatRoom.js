// VideoChatPatient Component
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Button from "@mui/material/Button";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PhoneIcon from "@mui/icons-material/Phone";
import { Typography } from "@mui/material";
import inputLabelClasses from "@mui/material";
import Peer from "simple-peer";
import io from "socket.io-client";
import '../VideoChat.css';
import "../process.js"

// const socket = io.connect('http://localhost:4000');

function VideoChatRoom({stream, myVideo, callAccepted, callEnded, userVideo, me, idToCall,setIdToCall,leaveCall, callUser, myName, receivingCall, answerCall}) {

return (
  <>
    <h1 style={{ textAlign: "center", color: "#fff" }}>El7a2ni Rooom Chat</h1>
    <div className="container">
      <div className="video-container">
        <div className="video">
          <Typography variant="h6" style={{ textAlign: "center", color: "#fff" }}>
            My Camera
          </Typography>
          {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "400px" }} />}
        </div>
        <div className="video">
          {callAccepted && !callEnded ? (
            <Typography variant="h6" style={{ textAlign: "center", color: "#fff" }}>
              Partner Camera
            </Typography>
          ) : null}
          {callAccepted && !callEnded ? (
            <video playsInline ref={userVideo} autoPlay style={{ width: "400px" }} />
          ) : null}
        </div>
      </div>

      <div className="myId">
        {myName
          // <InputLabel style={{ marginBottom: "20px" }}>
          //   <Typography variant="h6">Name: {myName}</Typography>
          // </InputLabel>
        }
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
                  <Typography
                    variant="h6"
                    style={{ textAlign: "center", color: "#fff" }}
                  >
                    {myName} is calling...
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={answerCall}
                  >
                    Answer
                  </Button>
                </div>
              ) : null}
      </div>
    </div>
  </>
);
}


export default VideoChatRoom;