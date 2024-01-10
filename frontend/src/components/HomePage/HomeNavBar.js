import { useState } from "react";
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import NotificationBoard from "../NotificationBoard";
import SideBar from "../SideBar";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const ImageStyle = {
  width: "75px",
  height: "80px",
  cursor: "pointer",
};

const HomeNavBar = ({ homeButton, setPage, user, setIcon1, setIcon2 }) => {
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
            <img
              style={ImageStyle}
              src="itrylogo-removebg-preview.png"
              alt="logo.png"
              onClick={homeButton}
            />
            <Box
              sx={{ display: "flex", alignItems: "center", marginLeft: "auto" }}
            >
              {setIcon1 && (
                <IconButton size="large" color="inherit" onClick={setIcon1}>
                  <ListAltIcon />
                </IconButton>
              )}
              {setIcon2 && (
                <IconButton size="large" color="inherit" onClick={setIcon2}>
                  <ShoppingCartIcon />
                </IconButton>
              )}
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
            setPage={setPage}
          />
        )}
        {isNotificationOpen && (
          <NotificationBoard onClose={() => setIsNotificationOpen(false)} />
        )}
      </Box>
    </>
  );
};

export default HomeNavBar;
