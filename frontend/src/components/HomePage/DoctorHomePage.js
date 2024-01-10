import { Box, Container, Grid } from "@mui/material";
import SquareCard from "../SquareCard";
import HomeNavBar from "./HomeNavBar";
import { useState } from "react";
import ProfilePage from "../ProfilePage";
import { HomePageContext } from "../../pages/HomePage";
import { useContext, useEffect, useRef } from "react";
import PersonIcon from "@mui/icons-material/Person";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import PatientsView from "../PatientsView";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HealingIcon from "@mui/icons-material/Healing";
import Fab from "@mui/material/Fab";
import PharmacistsStage from "../AdminEmployees/PharmacistsStage";
import axios from "axios";
import AppointmentsView from "../AppointmentsView";
import Chat from "../Chat";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import PhoneIcon from "@mui/icons-material/Phone";
import { Typography } from "@mui/material";
import inputLabelClasses from "@mui/material";
import Peer from "simple-peer";
import io from "socket.io-client";
import "../../VideoChat.css";
import "../../process.js";
import VideoChatRoom from "../VideoChatRoom.js";

const socket = io.connect("http://localhost:4000");

const DoctorHomePage = () => {
  const [showContent, setShowContent] = useState(false);
  const [page, setPage] = useState("home");
  const { user } = useContext(HomePageContext);
  const [chat, setChat] = useState(false);
  const [chatterID, setChatterID] = useState("");
  const [chatterName, setChatterName] = useState("");
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

  const initializeMediaDevices = async () => {
    try {
      // const userMediaStream = await
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
          if (myVideo.current) {
            myVideo.current.srcObject = stream;
          }
        });
      // setStream(userMediaStream);

      // if (myVideo.current) {
      //   myVideo.current.srcObject = userMediaStream;
      // }

      socket.on("me", async (id) => {
        console.log(id);
        setMe(id);
        await axios.put("/updateSocketId", { socketId: id });
      });
      setmyName("patient name");

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

  const callUser = async (id) => {
    const response = await axios.get("/getSocketId", {
      params: { userId: id },
    });
    console.log("socket id to be called :" + response.data);
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

  useEffect(() => {
    const login = async () => {
      await axios.get("/loginAuthentication").then(async (response) => {
        const { success, type, user } = response.data;
        if (success && type === "doctor" && user.status === "approved") {
          window.location.href = "/doctorContract";
        } else if (success && type === "doctor" && user.status === "rejected") {
          localStorage.clear();
          await axios.get("/logout");
          window.location.href = "/";
        } else {
          setShowContent(true);
        }
      });
    };
    login();
  }, []);

  const Home = () => {
    return (
      <>
        <Grid container spacing={5} sx={{ minHeight: "100vh" }}>
          <Grid item xs={12} sm={12} />
          <Grid item xs={12} sm={4} sx={{ marginTop: "-95px" }}>
            <SquareCard
              title="APPOINTMENTS"
              body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
              icon={AccessAlarmIcon}
              isLearnMore={false}
              changeFunction={() => setPage("appointments")}
              closeFunction={() => setPage("home")}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ marginTop: "-95px" }}>
            <SquareCard
              title="PATIENTS"
              body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
              icon={PersonIcon}
              isLearnMore={false}
              changeFunction={() => setPage("patients")}
              closeFunction={() => setPage("home")}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ marginTop: "-95px" }}>
            <SquareCard
              title="PHARMACISTS"
              body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
              icon={HealingIcon}
              isLearnMore={false}
              changeFunction={() => setPage("pharmacists")}
              closeFunction={() => setPage("home")}
            />
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <>
      {showContent && (
        <>
          <HomeNavBar homeButton={() => setPage("home")} setPage={setPage} />
          <Container sx={{ mt: 3 }}>
            <Grid container spacing={5}>
              {page === "profile" ? (
                <ProfilePage userData={user} />
              ) : page === "home" ? (
                <Home />
              ) : page === "appointments" ? (
                <AppointmentsView
                  backButton={(page) => setPage(page)}
                  userType="doctor"
                />
              ) : page === "patients" ? (
                <>
                  <PatientsView
                    userType={"doctor"}
                    backButton={() => setPage("home")}
                    setChat={setChat}
                    setChatterID={setChatterID}
                    setChatterName={setChatterName}
                    startVideoChat={initializeMediaDevices}
                    setStage={(e)=>setPage(e)}
                  />
                </>
              ) : page === "pharmacists" ? (
                <PharmacistsStage
                  setStage={() => setPage("home")}
                  together={true}
                  userType="doctor"
                  setChat={setChat}
                  setChatterID={setChatterID}
                  setChatterName={setChatterName}
                />
              ) : (
                <VideoChatRoom
                  stream={stream}
                  myVideo={myVideo}
                  callAccepted={callAccepted}
                  callEnded={callEnded}
                  userVideo={userVideo}
                  me={me}
                  idToCall={idToCall}
                  setIdToCall={setIdToCall}
                  leaveCall={leaveCall}
                  callUser={callUser}
                  myName={myName}
                  receivingCall={receivingCall}
                  answerCall={answerCall}
                />
              )}
              {chat && (
                <Chat
                  partner={chatterID}
                  name={chatterName}
                  setChat={setChat}
                />
              )}
              <Box sx={{ position: "absolute", top: "50%", left: "50%" }}>
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
              </Box>
            </Grid>
          </Container>
        </>
      )}
    </>
  );
};

export default DoctorHomePage;
