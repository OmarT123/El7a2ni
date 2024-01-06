import { useState } from "react";
import { Container, Grid } from "@mui/material";
import SquareCard from "../SquareCard";
import MedicationIcon from "@mui/icons-material/Medication";
import PersonIcon from "@mui/icons-material/Person";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import MedicineView from "../MedicineView";
import HomeNavBar from "./HomeNavBar";
import AdminsView from "../AdminsView";

const AdminHomePage = () => {
  const [stage, setStage] = useState("home");

  const Home = () => {
    return (
      <>
        <Grid item xs={12} sm={4}>
          <SquareCard
            title="MEDICINE"
            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
            icon={MedicationIcon}
            isLearnMore={false}
            changeFunction={() => setStage("medicine")}
            closeFunction={() => setStage("home")}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SquareCard
            title="EMPLOYEES"
            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
            icon={PersonIcon}
            isLearnMore={false}
            changeFunction={() => setStage("employees")}
            closeFunction={() => setStage("home")}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SquareCard
            title="PATIENTS"
            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
            icon={PersonIcon}
            isLearnMore={false}
            changeFunction={() => setStage("patients")}
            closeFunction={() => setStage("home")}
          />
        </Grid>
        <Grid item xs={0} sm={1.5} />
        <Grid item xs={12} sm={5}>
          <SquareCard
            title="ADMINS"
            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
            icon={SupervisorAccountIcon}
            isLearnMore={false}
            changeFunction={() => setStage("admins")}
            closeFunction={() => setStage("home")}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <SquareCard
            title="HEALTH PACKAGES"
            body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
            icon={Inventory2Icon}
            isLearnMore={false}
            changeFunction={() => setStage("healthPackages")}
            closeFunction={() => setStage("home")}
          />
        </Grid>
      </>
    );
  };

  return (
    <>
      <HomeNavBar homeButton={() => setStage("home")} />

      <Container sx={{ mt: 3 }}>
        <Grid container spacing={5}>
          {stage === "home" ? (
            <Home />
          ) : stage === "medicine" ? (
            <MedicineView userType={"admin"} />
          ) : stage === "employees" ? (
            "employees"
          ) : stage === "patients" ? (
            "patient"
          ) : stage === "admins" ? (
            <AdminsView />
          ) : (
            "healthPackages"
          )}
        </Grid>
      </Container>
    </>
  );
};

export default AdminHomePage;
