import { Box, Container, Grid } from "@mui/material";
import SquareCard from "../SquareCard";
import HomeNavBar from "./HomeNavBar";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { useState } from "react";
import ProfilePage from "../ProfilePage";
import { HomePageContext } from "../../pages/HomePage";
import { useContext, useRef, useEffect } from "react";
import MedicationIcon from "@mui/icons-material/Medication";
import HealingIcon from "@mui/icons-material/Healing";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import MedicineView from "../MedicineView";
import DoctorsStage from "../AdminEmployees/DoctorsStage";
import HealthPackagesView from "../HealthPackagesView";
import PatientPage from "../PatientPage";
import PharmacistsStage from "../AdminEmployees/PharmacistsStage";
import AppointmentsView from "../AppointmentsView";
import MyCart from "../MyCart";
import Chat from "../Chat";
import Orders from "../Orders";
import Popup from "../Popup";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Button from "@mui/material/Button";
import axios from "axios";
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

const PatientHomePage = () => {
  const [page, setPage] = useState("home");
  const { user } = useContext(HomePageContext);
  const [chat, setChat] = useState(false);
  const [chatterID, setChatterID] = useState("");
  const [chatterName, setChatterName] = useState("");
  const [alert, setAlert] = useState(null);
  const [doctor, setDoctor] = useState("");
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

  const initializeMediaDevices = async (id) => {
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
        setIdToCall(id)
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

  const closePopup = () => {
    setAlert(null);
  };

  const Home = () => {
    return (
      <>
        <Grid item xs={12} sm={12} />
        <Grid item xs={12} sm={4}>
          <SquareCard
            title="MEDICAL FILE"
            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
            icon={AssignmentIcon}
            isLearnMore={false}
            changeFunction={() => setPage("medicalFile")}
            closeFunction={() => setPage("home")}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SquareCard
            title="APPOINTMENTS"
            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
            icon={AccessAlarmIcon}
            isLearnMore={false}
            changeFunction={() => setPage("appointments")}
            closeFunction={() => setPage("home")}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SquareCard
            title="MEDICINE"
            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
            icon={VaccinesIcon}
            isLearnMore={false}
            changeFunction={() => setPage("medicine")}
            closeFunction={() => setPage("home")}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SquareCard
            title="HEALTH PACKAGE"
            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
            icon={MedicationIcon}
            isLearnMore={false}
            changeFunction={() => setPage("healthPackages")}
            closeFunction={() => setPage("home")}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SquareCard
            title="DOCTORS"
            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
            icon={LocalHospitalIcon}
            isLearnMore={false}
            changeFunction={() => setPage("doctors")}
            closeFunction={() => setPage("home")}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SquareCard
            title="PHARMACISTS"
            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
            icon={HealingIcon}
            isLearnMore={false}
            changeFunction={() => setPage("pharmacists")}
            closeFunction={() => setPage("home")}
          />
        </Grid>
      </>
    );
  };

  return (
    <>
      <HomeNavBar
        homeButton={() => setPage("home")}
        setPage={setPage}
        setIcon1={() => setPage("orders")}
        setIcon2={() => setPage("MyCart")}
      />
      <Container sx={{ mt: 3 }}>
        <Grid container spacing={5}>
          {page === "profile" ? (
            <ProfilePage userData={user} />
          ) : page === "home" ? (
            <Home />
          ) : page === "medicine" ? (
            <MedicineView
              userType={"patient"}
              setPage={(path) => setPage(path)}
            />
          ) : page === "doctors" ? (
            <DoctorsStage
              setStage={(path) => setPage(path)}
              together={true}
              userType={"patient"}
              setChat={setChat}
              setChatterID={setChatterID}
              setChatterName={setChatterName}
              setAlert={setAlert}
              setDoctor={setDoctor}
              startVideoChat={initializeMediaDevices}

            />
          ) : page === "pharmacists" ? (
            <PharmacistsStage
              setStage={() => setPage("home")}
              together={true}
              userType="patient"
              setChat={setChat}
              setChatterID={setChatterID}
              setChatterName={setChatterName}
            />
          ) : page === "appointments" ? (
            <AppointmentsView
              backButton={(page) => setPage(page)}
              userType={"patient"}
            />
          ) : page === "healthPackages" ? (
            <HealthPackagesView userType={"patient"} />
          ) : page === "medicalFile" ? (
            <PatientPage
              userType={"patient"}
              selectedPatient={user}
              setAlert={setAlert}
            />
          ) : page === "MyCart" ? (
            <MyCart setPage={(path) => setPage(path)} />
          ) : page === "orders" ? (
            <Orders />
          ) : (
            <>
              <VideoChatRoom
              stream={stream} myVideo={myVideo} callAccepted={callAccepted} callEnded={callEnded} userVideo={userVideo} me={me} idToCall={idToCall} setIdToCall={setIdToCall} leaveCall={leaveCall} callUser={callUser} myName={myName} receivingCall={receivingCall} answerCall={answerCall} />
            </>
          )}
          {chat && (
            <Chat partner={chatterID} name={chatterName} setChat={setChat} />
          )}
          {alert && (
            <Popup
              onClose={closePopup}
              title={alert.title}
              message={alert.message}
              showButtons={false}
            />
          )}
          {receivingCall && !callAccepted ? (
          <div className="caller">
            <Typography variant="h6" style={{ textAlign: "center", color: "#fff" }}>
              {myName} is calling...
            </Typography>
            <Button variant="contained" color="primary" onClick={answerCall}>
              Answer
            </Button>
          </div>
        ) : null}
        </Grid>
      </Container>
    </>
  );
};

export default PatientHomePage;
