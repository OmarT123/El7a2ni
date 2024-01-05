import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Box,
  Grid,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import SquareCard from "../../SquareCard";
import MedicationIcon from "@mui/icons-material/Medication";
import PersonIcon from "@mui/icons-material/Person";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import NotificationBoard from "../../NotificationBoard";
import SideBar from "../../SideBar";
import MedicineView from "../../MedicineView";

const ImageStyle = {
  width: "100px",
  height: "90px",
  cursor: 'pointer'
};

const NavBar = ({homeButton}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleBackButton = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          sx={{
            height: "100px",
            paddingLeft: "30px",
            paddingRight: "30px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Toolbar sx={{ alignItems: "center" }}>
            <img style={ImageStyle} src="logo.png" alt="logo.png" onClick={homeButton} />
            <Box
              sx={{ display: "flex", alignItems: "center", marginLeft: "auto" }}
            >
              <IconButton size="large" color="inherit">
                <MailIcon />
              </IconButton>
              <IconButton
                size="large"
                color="inherit"
                onClick={() => setIsNotificationOpen(true)}
              >
                <NotificationsIcon />
              </IconButton>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleSidebarToggle}
              >
                <SettingsIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Toolbar />
        <Toolbar />

        {isSidebarOpen && (
          <SideBar
            isSidebarOpen={isSidebarOpen}
            handleSidebarToggle={handleSidebarToggle}
            handleBackButton={handleBackButton}
          />
        )}
        {isNotificationOpen && (
          <NotificationBoard onClose={() => setIsNotificationOpen(false)} />
        )}
      </Box>
    </>
  );
};

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
      <NavBar homeButton={() => setStage('home')} />

      <Container sx={{ mt: 3 }}>
        <Grid container spacing={5}>
          {stage === "home" ? (
            <Home />
          ) : stage === "medicine" ? (
            <MedicineView />
          ) : stage === "employees" ? (
            "employees"
          ) : stage === "patients" ? (
            "patient"
          ) : stage === "admins" ? (
            "admins"
          ) : (
            "healthPackages"
          )}
        </Grid>
      </Container>
    </>
  );
};

export default AdminHomePage;
