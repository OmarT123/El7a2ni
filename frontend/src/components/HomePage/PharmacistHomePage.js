import { Box, Container, Grid } from "@mui/material";
import SquareCard from "../SquareCard";
import HomeNavBar from "./HomeNavBar";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { useState } from "react";
import ProfilePage from "../ProfilePage";
import { HomePageContext } from "../../pages/HomePage";
import { useContext } from "react";
import VaccinesIcon from '@mui/icons-material/Vaccines';
import HealingIcon from '@mui/icons-material/Healing';
import MedicineView from "../MedicineView";
import DoctorsStage from "../AdminEmployees/DoctorsStage";
import PatientsView from "../PatientsView";
import Chat from "../Chat";

const PharmacistHomePage = () => {
  const [page, setPage] = useState("home");
  const { user } = useContext(HomePageContext);
  const [chat, setChat] = useState(false);
  const [chatterID, setChatterID] = useState('');
  const [chatterName, setChatterName] = useState('');

  const Home = () => {
    return (
      <>
        <Grid container spacing={5} sx={{ minHeight: "100vh" }}>
          <Grid item xs={12} sm={12} />
          <Grid item xs={12} sm={4} sx={{marginTop:"-95px"}}>
            <SquareCard
              title="MEDICINE"
              body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
              icon={VaccinesIcon}
              isLearnMore={false}
              changeFunction={() => setPage("medicine")}
              closeFunction={() => setPage("home")}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{marginTop:"-95px"}}>
            <SquareCard
              title="DOCTORS"
              body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
              icon={LocalHospitalIcon}
              isLearnMore={false}
              changeFunction={() => setPage("doctors")}
              closeFunction={() => setPage("home")}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{marginTop:"-95px"}}>
            <SquareCard
              title="PATIENTS"
              body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
              icon={HealingIcon}
              isLearnMore={false}
              changeFunction={() => setPage("patients")}
              closeFunction={() => setPage("home")}
            />
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <>
      <HomeNavBar homeButton={() => setPage("home")} setPage={setPage} />
      <Container sx={{ mt: 3 }}>
        <Grid container spacing={5}>
          {page === "profile" ? (
            <ProfilePage userData={user} />
          ) : page === "home" ? (
            <Home />
          ) : page === "medicine" ? (
            <MedicineView userType={"pharmacist"} />
          ) : page === "doctors" ? (
            <DoctorsStage
              setStage={() => setPage("home")}
              together={true}
              userType={"pharmacist"}
              setChat={setChat}
              setChatterID={setChatterID}
              setChatterName={setChatterName}
            />
          ) : (
            <PatientsView
              userType={"pharmacist"}
              backButton={() => setPage("home")}
              setChat={setChat}
              setChatterID={setChatterID}
              setChatterName={setChatterName}
            />
          )}
          {chat && <Chat partner={chatterID} name={chatterName} setChat={setChat} />}
        </Grid>
      </Container>
    </>
  );
};

export default PharmacistHomePage;
