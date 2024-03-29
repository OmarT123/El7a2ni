import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import { Button, TextField, Box } from "@mui/material";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import MenuItem from '@mui/material/MenuItem';
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
  const [updateExpanded, setUpdateExpanded] = useState("");
  const [updatePrice, setUpdatePrice] = useState("");
  const [updateDoctorDiscount, setUpdateDoctorDiscount] = useState("");
  const [updateFamilyDiscount, setUpdateFamilyDiscount] = useState("");
  const [updateMedicineDiscount, setUpdateMedicineDiscount] = useState("");
  const [myHealthPackage, setMyHealthPackage] = useState("");
  const [myFamilyMembersHealthPackages, setMyFamilyMembersHealthPackages] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);

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
      try {
        const response = await axios.post("/addHealthPackage", body);
        if (response.data.success) {
          setAlert(response.data);
          setName("");
          setPrice("");
          setDoctorDiscount("");
          setMedicineDiscount("");
          setFamilyDiscount("");
          setAddPackageExpanded(false);
          fetchHealthPackages();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteHealthPackage = async (id) => {
    try {
      const response = await axios.delete("/deleteHealthPackage?id=" + id);
      if (response.data.success) {
        setAlert(response.data);
        fetchHealthPackages();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const enableUpdate = () => {
    setUpdateExpanded((prev) => !prev);
  };

  const updateHealthPackage = async (e, id) => {
    e.preventDefault();

    const body = {};
    if (updatePrice !== "") body["price"] = updatePrice;
    if (updateDoctorDiscount !== "")
      body["doctorDiscount"] = updateDoctorDiscount;
    if (updateMedicineDiscount !== "")
      body["medicineDiscount"] = updateMedicineDiscount;
    if (updateFamilyDiscount !== "")
      body["familyDiscount"] = updateFamilyDiscount;

    try {
      const response = await axios.put("/editHealthPackage?id=" + id, body);
      if (response.data.success) {
        setAlert(response.data);
        setUpdatePrice("");
        setUpdateDoctorDiscount("");
        setUpdateFamilyDiscount("");
        setUpdateMedicineDiscount("");
        setUpdateExpanded(false);
        setExpandedItem(null);
        fetchHealthPackages();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyHealthPackage = async () => {
    const response = await axios.get("/viewMySubscribedHealthPackage");
    if (response.data.success) {
      setMyFamilyMembersHealthPackages(response.data.familyMembersHealthPackages);
      setMyHealthPackage(response.data.myHealthPackage);
      console.log(response.data.familyMembersHealthPackages);
    }
    else {
      setAlert({ title: "", message: response.data.message });
    }
  }

  const fetchFamilyMembers = async () => {
    const response = await axios.get("getFamilyMembers");
    setFamilyMembers(response.data);
  }

  const handleSubsribe = async (e, price, id) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const paymentMethod = data.get("paymentMethod");
    if(paymentMethod === "card")
      payWithCard(e, price, id);
    else
      payWithWallet(e, price, id);
  }

  const payWithWallet = async (e, price, id) => {
    const body = {};
    body["price"] = price;
    const data = new FormData(e.currentTarget);
    const familyMemberName = data.get("fm");
    const response = await axios.get("/payWithWallet", { params: body });
    if (response.data.success) {
      await axios.put("buyHealthPackage", {name : familyMemberName, healthPackageId: id});
      setAlert({ title: "Payment Accepted", message: "You have successully subscribed to this health package."})
    } else {
      setAlert({ title: "Payment Failed", message: "Insufficient funds" });
    }
  };

  const payWithCard = async (e, price, id) => {
    const body = {};
    const data = new FormData(e.currentTarget);
    const familyMemberName = data.get("fm");
    body["item"] = { ID: id, price: price };
    body["name"] = familyMemberName;
    await axios.get("/payWithCardPackage", { params: body }).then((res) => (window.location.href = res.data.url)).catch((err) => console.log(err));
  };

  const cancelPackage = async () => {
    const response = await axios.put("CancelSubscription");
    setAlert({ title: "", message: response.data.message });
    fetchMyHealthPackage();
  }

  useEffect(() => {
    if (userType === "patient") {
      fetchMyHealthPackage();
      fetchFamilyMembers();
    }
    fetchHealthPackages();
  }, []);

  const closePopup = () => {
    setAlert(null);
  };

  return (
    <>
      {userType === "patient" &&
        <Paper style={paperStyle} elevation={3}>
          <Typography variant="h4" sx={{ m: "30px" }}>
            My Health Package
          </Typography>
          <Container maxWidth="md" sx={{ marginTop: 2, padding: "5px" }}>
            {myHealthPackage && <><Typography variant="h5" sx={{ marginBottom: 2 }}>
              {myHealthPackage.name}
            </Typography><Grid container spacing={3}>
                <Grid item xs={6}>
                  <List>
                    <ListItem>
                      <ListItemText primary={`Status: ${myHealthPackage.status}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary={`End Date: ${myHealthPackage.endDate.substr(0, 10)}`} />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={6}>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary={`Medicine Discount: ${myHealthPackage.medicineDiscount}%`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary={`Doctor Discount: ${myHealthPackage.doctorDiscount}%`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary={`Family Discount: ${myHealthPackage.familyDiscount}%`} />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              {myHealthPackage.status !== "cancelled" && <Button
                variant="contained"
                onClick={() => cancelPackage(myHealthPackage.patientID)}
                sx={{ m: "30px" }}
              >
                Cancel Health Package
              </Button>}
            </>}
          </Container>
          <hr />
          <Typography variant="h4" sx={{ m: "30px" }}>
            Family Members Health Packages
          </Typography>
          <Container maxWidth="md" sx={{ marginTop: 2, padding: "5px" }}>
            {myFamilyMembersHealthPackages.length === 0 && <Typography variant="substitute">There were no family member health packages found.</Typography>}
            {myFamilyMembersHealthPackages.map((familyMemberHealthPackage, index) => (
              <React.Fragment key={index}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                  {familyMemberHealthPackage.name}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <List>
                      <ListItem>
                        <ListItemText primary={`Patient name: ${familyMemberHealthPackage.patientName}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={`Status: ${familyMemberHealthPackage.status}`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary={`End Date: ${familyMemberHealthPackage.endDate.substr(0, 10)}`} />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={6}>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary={`Medicine Discount: ${familyMemberHealthPackage.medicineDiscount}%`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary={`Doctor Discount: ${familyMemberHealthPackage.doctorDiscount}%`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary={`Family Discount: ${familyMemberHealthPackage.familyDiscount}%`} />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
                {familyMemberHealthPackage.status !== "cancelled" && <Button
                  variant="contained"
                  onClick={() => cancelPackage(familyMemberHealthPackage.patientID)}
                  sx={{ m: "30px" }}
                >
                  Cancel Health Package
                </Button>}
              </React.Fragment>
            ))}
          </Container>

        </Paper>
      }
      <Paper style={paperStyle} elevation={3}>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Typography variant="h4" sx={{ m: "30px" }}>
            Health Package Options
          </Typography>
          {userType !== "patient" && <Fab style={buttonStyle} onClick={handleAddPackageClick}>
            {addPackageExpanded ? (
              <ClearIcon style={iconStyle} />
            ) : (
              <AddIcon style={iconStyle} />
            )}
          </Fab>}
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
                  label="Name"
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
                  type="number"
                  onChange={(e) => setDoctorDiscount(e.target.value)}
                  sx={{ marginBottom: "10px", width: "33%" }}
                />
                <Box sx={{ width: "0.5%" }} />
                <TextField
                  label="Medicine Discount"
                  variant="outlined"
                  value={medicineDiscount}
                  type="number"
                  onChange={(e) => setMedicineDiscount(e.target.value)}
                  sx={{ marginBottom: "10px", width: "33%" }}
                />
                <Box sx={{ width: "0.5%" }} />
                <TextField
                  label="Family Member Discount"
                  variant="outlined"
                  value={familyDiscount}
                  type="number"
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
        <List style={listStyle}>
          {healthPackages.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem button onClick={() => handleItemExpand(item)}>
                <HealthAndSafetyIcon
                  sx={{ mr: "15px", width: "50px", height: "50px" }}
                />
                <Container maxWidth="md" sx={{ marginTop: 2, padding: "5px" }}>
                  <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    {item.name}
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <List>
                        <ListItem>
                          <ListItemText primary={`Price: ${item.price}$`} />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary={`Medicine Discount: ${item.medicineDiscount}%`}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={6}>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary={`Doctor Discount: ${item.doctorDiscount}%`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary={`Family Discount: ${item.familyDiscount}%`}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </Container>
              </ListItem>
              <Collapse
                in={item.name === expandedItem}
                timeout="auto"
                unmountOnExit
              >
                {userType !== "patient" && <><Button
                  variant="contained"
                  onClick={() => enableUpdate(item._id)}
                  sx={{ m: "30px" }}
                >
                  Update Health Package
                </Button><Button
                  variant="contained"
                  onClick={() => deleteHealthPackage(item._id)}
                  sx={{ m: "30px" }}
                >
                    Delete Health Package
                  </Button>
                  <Collapse in={updateExpanded} timeout="auto" unmountOnExit>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                          <Box sx={{ width: "1%" }} />
                          <TextField
                            label="Price"
                            variant="outlined"
                            value={updatePrice}
                            onChange={(e) => setUpdatePrice(e.target.value)}
                            type="number"
                            min={0}
                            sx={{ marginBottom: "10px", width: "49.5%" }} />
                          <Box sx={{ width: "1%" }} />
                          <TextField
                            label="Doctor Discount"
                            variant="outlined"
                            value={updateDoctorDiscount}
                            type="number"
                            onChange={(e) => setUpdateDoctorDiscount(e.target.value)}
                            sx={{ marginBottom: "10px", width: "49.5%" }} />
                        </Box>
                        <Box
                          sx={{ display: "flex", flexDirection: "row", ml: 1.5 }}
                        >
                          <TextField
                            label="Medicine Discount"
                            variant="outlined"
                            value={updateMedicineDiscount}
                            type="number"
                            onChange={(e) => setUpdateMedicineDiscount(e.target.value)}
                            sx={{ marginBottom: "10px", width: "49.5%" }} />
                          <Box sx={{ width: "1%" }} />
                          <TextField
                            label="Family Member Discount"
                            variant="outlined"
                            value={updateFamilyDiscount}
                            type="number"
                            onChange={(e) => setUpdateFamilyDiscount(e.target.value)}
                            sx={{ marginBottom: "10px", width: "49.5%" }} />
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        onClick={(e) => updateHealthPackage(e, item._id)}
                        sx={{ width: "100%" }}
                      >
                        Update Health Package
                      </Button>
                    </Box>
                  </Collapse></>
                }
                {
                  userType === "patient" &&
                  <>
                    <Box component={"form"} onSubmit={(e) => handleSubsribe(e, item.price, item._id)} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        variant="contained"
                        sx={{ width: "100%" }}
                        type="submit"
                      >
                        Subscribe to this Health Package
                      </Button>
                      <TextField
                        id="paymentMethod"
                        label="Choose Payment Method"
                        select
                        name="paymentMethod"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{ width: "100%", marginLeft: '50px' }}
                      >
                        <MenuItem value={"card"}>Credit Card</MenuItem>
                        <MenuItem value={"wallet"}>Wallet</MenuItem>
                      </TextField>
                      <TextField
                        id="fm"
                        label="Choose Family Member"
                        select
                        name="fm"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{ width: "100%", marginLeft: '50px' }}
                      >
                        {familyMembers.map((member, index) => (
                          <MenuItem key={index} value={member}>
                            {member}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  </>
                }
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
      </Paper >
    </>
  );
};

export default HealthPackagesView;
