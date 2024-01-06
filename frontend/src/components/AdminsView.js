import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import { Button, TextField, Box } from "@mui/material";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import Popup from "./Popup";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const paperStyle = {
  width: "1200px",
  margin: "auto",
  padding: 16,
  marginTop: "30px",
};

const listStyle = {
  marginTop: 16,
};

const buttonStyle = {
  backgroundColor: "#1976D2",
  color: "#fff",
  borderRadius: "50%",
  width: "56px",
  height: "56px",
  cursor: "pointer",
  marginTop: "20px",
  "&:hover": {
    backgroundColor: "#1565C0",
  },
};

const iconStyle = {
  fontSize: "2rem",
};

const AdminsView = ({ userType }) => {
  const [admins, setAdmins] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [isAddAdminExpanded, setAddAdminExpanded] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleItemExpand = (item) => {
    setExpandedItem(item.username === expandedItem ? null : item.username);
  };

  const handleAddAdminClick = () => {
    setAddAdminExpanded((prev) => !prev);
  };

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("/getAllAdmins");
      const medicinesData = res.data;
      setAdmins(medicinesData);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const addAdmin = async (e) => {
    e.preventDefault();
    const newAdminData = {};
    if (newName === "" || newPassword === "") {
      setAlert({ title: "Incomplete Data", message: "Please fill all fields" });
    } else {
      if (newName !== "") newAdminData["username"] = newName;
      if (newPassword !== "") newAdminData["password"] = newPassword;

      try {
        const response = await axios.post("/addAdmin", newAdminData);
        setAlert(response.data);
        //   console.log(response.data);
        if (response.data.success) {
          console.log("here");
          setNewName("");
          setNewPassword("");
          setAddAdminExpanded(false);
          fetchAdmins();
        }
      } catch (error) {
        console.error("Add Admin error:", error);
      }
    }
  };

  const removeAdmin = async (adminId) => {
    try {
      const response = await axios.delete("/deleteAdmin?id=" + adminId);
      setAlert(response.data);
      if (response.data.success) {
        fetchAdmins();
      }
    } catch (error) {
      console.error("Add Admin error:", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const closePopup = () => {
    setAlert(null);
  };

  return (
    <>
      <Paper style={paperStyle} elevation={3}>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Typography variant="h4" sx={{ m: "30px" }}>
            Admins
          </Typography>
          <Fab style={buttonStyle} onClick={handleAddAdminClick}>
            {isAddAdminExpanded ? (
              <ClearIcon style={iconStyle} />
            ) : (
              <AddIcon style={iconStyle} />
            )}
          </Fab>
        </Box>
        <Collapse in={isAddAdminExpanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <TextField
                label="Username"
                variant="outlined"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                sx={{ marginBottom: "10px", width: "49.5%" }}
              />
              <Box sx={{ width: "1%" }} />
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ marginBottom: "10px", width: "49.5%" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Button
              variant="contained"
              onClick={addAdmin}
              sx={{ width: "100%" }}
            >
              Add Admin
            </Button>
          </Box>
        </Collapse>

        <List style={listStyle}>
          {admins.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem button onClick={() => handleItemExpand(item)}>
                <SupervisorAccountIcon sx={{ mr: "15px" }} />
                <ListItemText primary={item.username} />
              </ListItem>
              <Collapse
                in={item.username === expandedItem}
                timeout="auto"
                unmountOnExit
              >
                <Button
                  variant="contained"
                  onClick={() => removeAdmin(item._id)}
                  sx={{ m: "30px" }}
                >
                  Remove Admin
                </Button>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
        {alert && (
          <Popup
            onClose={closePopup}
            title={alert.title}
            message={alert.message}
            showButtons={false}
          />
        )}
      </Paper>
    </>
  );
};

export default AdminsView;
