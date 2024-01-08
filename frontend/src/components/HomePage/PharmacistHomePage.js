import { Box, Container, Grid } from "@mui/material";
import SquareCard from "../SquareCard";
import HomeNavBar from "./HomeNavBar";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { useState } from "react";
import ProfilePage from "../ProfilePage";
import { HomePageContext } from "../../pages/HomePage";
import { useContext } from "react";
import MedicationIcon from "@mui/icons-material/Medication";
import MedicineView from "../MedicineView";
import DoctorsStage from "../AdminEmployees/DoctorsStage";

const PharmacistHomePage = () => {
  const [page, setPage] = useState("home");
  const { user } = useContext(HomePageContext);

  const Home = () => {
    return (
      <>
        <Grid container spacing={5} sx={{ minHeight: "100vh" }}>
          <Grid item xs={12} sm={12} />
          <Grid item xs={0} sm={2} />
          <Grid item xs={12} sm={4}>
            <SquareCard
              title="MEDICINE"
              body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
              icon={MedicationIcon}
              isLearnMore={false}
              changeFunction={() => setPage("medicine")}
              closeFunction={() => setPage("home")}
            />
          </Grid>
          <Grid item xs={0} sm={1} />
          <Grid item xs={12} sm={3.5}>
            <SquareCard
              title="DOCTORS"
              body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
              icon={LocalHospitalIcon}
              isLearnMore={false}
              changeFunction={() => setPage("doctors")}
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
          ) : (
            <DoctorsStage
              setStage={() => setPage("home")}
              together={true}
              userType={"pharmacist"}
            />
          )}
        </Grid>
      </Container>
    </>
  );
};

export default PharmacistHomePage;
