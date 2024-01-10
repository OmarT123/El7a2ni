import Box from "@mui/material/Box";
import { HomePageContext } from "../pages/HomePage";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Collapse } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Notification = ({ notification }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <h3 onClick={handleToggle} style={{ cursor: 'pointer' }}>
        {notification.title} {!isExpanded && <ExpandMoreIcon sx={{height:'15px'}}/>}{isExpanded && <ExpandLessIcon sx={{height:'15px'}}/>}
      </h3>
      <Collapse in={isExpanded} sx={{marginTop:'-8px'}}>
        {<p>{notification.message}</p>}
      </Collapse>
    </Box>
  );
};

const NotificationBoard = ({ onClose }) => {
  const { user, userType } = useContext(HomePageContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  let apiLink;
  if (userType === 'pharmacist')
    apiLink = '/pharmacistRetrieveNotifications';
  if (userType === 'doctor')
    apiLink = '/doctorRetrieveNotifications';
  if (userType === 'patient')
    apiLink = '/patientRetrieveNotifications';

  useEffect(() => {
    axios.get(apiLink)
      .then((response) => {
        setNotifications(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      });
  }, [apiLink]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
          position: "relative",
          padding: "20px",
          width: "80%",
          maxWidth: "800px",
          maxHeight: "50%",
    overflowY: "auto", // Add this line to enable scrolling
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "8px",
            right: "8px",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          &times;
        </Box>
        <Box
          sx={{
            borderBottom: "1px solid #ccc",
            paddingBottom: "10px",
            marginBottom: "20px",
            textAlign: "center", // Centers the title text
          }}
        >
          <h2 style={{ color: "#4E4FEB", fontWeight: "bold" }}>
            Notifications
          </h2>
        </Box>
        {loading && <p>Loading...</p>}
        {!loading && notifications.length === 0 && <p>No recent notifications.</p>}
        {!loading && notifications.map((notification) => (
          <Notification key={notification._id} notification={notification} />
        ))}
      </Box>
    </Box>
  );
};

export default NotificationBoard;