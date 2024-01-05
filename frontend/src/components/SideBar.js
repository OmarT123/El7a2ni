import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountCircle from "@mui/icons-material/AccountCircle";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import FeedbackIcon from "@mui/icons-material/Feedback";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import axios from 'axios'

const SideBar = ({ isSidebarOpen, handleSidebarToggle, handleBackButton }) => {


  const handleLogout = async () => {
    try {
      const response = await axios.get('/logout');

      if (response.data.success) {
        localStorage.removeItem('userToken');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isSidebarOpen}
      onClose={handleSidebarToggle}
      PaperProps={{ sx: { width: "400px", backgroundColor: "#EEEEEE" } }}
    >
      <List>
        <ListItem button onClick={handleBackButton}>
          <ListItemIcon>
            <ArrowBackIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <HelpCenterIcon />
          </ListItemIcon>
          <ListItemText primary="Help & Support" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <FeedbackIcon />
          </ListItemIcon>
          <ListItemText primary="Give Feedback" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SideBar;
