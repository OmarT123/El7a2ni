import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import SearchBar from "./SearchBar";
import axios from "axios";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import { Button, TextField, Box } from "@mui/material";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { AirlineSeatLegroomNormalTwoTone } from "@mui/icons-material";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import Popup from "./Popup";
import { Container, Grid } from "@mui/material";

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

const HealthPackagesView = ({ userType }) => {
  const [healthPackages, setHealthPackages] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [addPackageExpanded, setAddPackageExpanded] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [doctorDiscount, setDoctorDiscount] = useState("");
  const [medicineDiscount, setMedicineDiscount] = useState("");
  const [familyDiscount, setFamilyDiscount] = useState("");
  const [alert, setAlert] = useState(null);

  const handleItemExpand = (item) => {
    setExpandedItem(item.name === expandedItem ? null : item.name);
  };

  const handleAddPackageClick = () => {
    console.log("add health package");
    console.log(addPackageExpanded);
    setAddPackageExpanded(!addPackageExpanded);
  };

  const fetchHealthPackages = async () => {
    try {
      const response = await axios.get("/getAllHealthPackages");
      console.log(response.data);
      setHealthPackages(response.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const addHealthPackage = async (e) => {
    e.preventDefault();

    if (
      name === "" ||
      price === "" ||
      medicineDiscount === "" ||
      doctorDiscount === "" ||
      familyDiscount === ""
    ) {
      setAlert({ title: "Incomplete Data", message: "Please fill all fields" });
    } else {
      const body = {
        name,
        price,
        doctorDiscount,
        medicineDiscount,
        familyDiscount,
      };
      await axios
        .post("/addHealthPackage", body)
        .then((res) => alert(res.data))
        .catch((err) => console.log(err.message));
      fetchHealthPackages();
    }
  };
  const deleteHealthPackage = () => {};

  //   const addAdmin = async (e) => {
  //     e.preventDefault();
  //     const newAdminData = {};
  //     if (newName !== "") newAdminData["username"] = newName;
  //     if (newPassword !== "") newAdminData["password"] = newPassword;

  //     try {
  //       const response = await axios.post("/addAdmin", newAdminData);
  //       setAlert(response.data);
  //       console.log(response.data);
  //       if (response.data.success) {
  //         console.log("here");
  //         setNewName("");
  //         setNewPassword("");
  //         setAddAdminExpanded(false);
  //         fetchAdmins();
  //       }
  //     } catch (error) {
  //       console.error("Add Admin error:", error);
  //     }
  //   };

  //   const removeAdmin = async (adminId) => {
  //     try {
  //       const response = await axios.delete("/deleteAdmin?id=" + adminId);
  //       setAlert(response.data);
  //       if (response.data.success) {
  //         fetchAdmins();
  //       }
  //     } catch (error) {
  //       console.error("Add Admin error:", error);
  //     }
  //   };

  useEffect(() => {
    fetchHealthPackages();
  }, []);

  const closePopup = () => {
    setAlert(null);
  };

  return (
    <>
      <Paper style={paperStyle} elevation={3}>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Typography variant="h4" sx={{ m: "30px" }}>
            Health Packages
          </Typography>
          <Fab style={buttonStyle} onClick={handleAddPackageClick}>
            {addPackageExpanded ? (
              <ClearIcon style={iconStyle} />
            ) : (
              <AddIcon style={iconStyle} />
            )}
          </Fab>
        </Box>
        <Collapse in={addPackageExpanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <TextField
                  label="Username"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ marginBottom: "10px", width: "49.5%" }}
                />
                <Box sx={{ width: "1%" }} />
                <TextField
                  label="Price"
                  variant="outlined"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  min={0}
                  sx={{ marginBottom: "10px", width: "49.5%" }}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row", ml: 2 }}>
                <TextField
                  label="Doctor Discount"
                  variant="outlined"
                  value={doctorDiscount}
                  onChange={(e) => setDoctorDiscount(e.target.value)}
                  sx={{ marginBottom: "10px", width: "33%" }}
                />
                <Box sx={{ width: "0.5%" }} />
                <TextField
                  label="Medicine Discount"
                  variant="outlined"
                  value={medicineDiscount}
                  onChange={(e) => setMedicineDiscount(e.target.value)}
                  sx={{ marginBottom: "10px", width: "33%" }}
                />
                <Box sx={{ width: "0.5%" }} />
                <TextField
                  label="Family Member Discount"
                  variant="outlined"
                  value={familyDiscount}
                  onChange={(e) => setFamilyDiscount(e.target.value)}
                  sx={{ marginBottom: "10px", width: "33%" }}
                />
                <Box sx={{ width: "1%" }} />
              </Box>
            </Box>
            <Button
              variant="contained"
              onClick={addHealthPackage}
              sx={{ width: "100%" }}
            >
              Create Health Package
            </Button>
          </Box>
        </Collapse>
        <Grid container spacing={1} sx={{mt:'12px'}}>
          <Grid xs={0.7}></Grid>
          <Grid item>
            <Typography>Name</Typography>
          </Grid>
          <Grid xs={2}></Grid>
          <Grid item>
            <Typography>Price</Typography>
          </Grid>
          <Grid xs={1.3}></Grid>
          <Grid item>
            <Typography>Family Discount</Typography>
          </Grid>
          <Grid xs={0.7}></Grid>
          <Grid item>
            <Typography>Medicine Discount</Typography>
          </Grid>
          <Grid xs={0.7}></Grid>
          <Grid item>
            <Typography>Doctor Discount</Typography>
          </Grid>
        </Grid>
        <List style={listStyle}>
          {healthPackages.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem button onClick={() => handleItemExpand(item)}>
                <HealthAndSafetyIcon sx={{ mr: "15px" }} />
                <ListItemText primary={item.name} />
                <ListItemText primary={item.price} />
                <ListItemText primary={item.familyDiscount} />
                <ListItemText primary={item.medicineDiscount} />
                <ListItemText primary={item.doctorDiscount} />
              </ListItem>
              <Collapse
                in={item.name === expandedItem}
                timeout="auto"
                unmountOnExit
              >
                <Button
                  variant="contained"
                  onClick={() => deleteHealthPackage(item._id)}
                  sx={{ m: "30px" }}
                >
                  Delete Health Package
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

export default HealthPackagesView;
