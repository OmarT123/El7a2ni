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

const SideBar = ({ isSidebarOpen, handleSidebarToggle, handleBackButton }) => {
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
        <ListItem button>
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
