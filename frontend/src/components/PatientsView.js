import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import { Button, TextField, Box, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Popup from "./Popup";
import { Container, Grid } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Fab from "@mui/material/Fab";
import PatientPage from "./PatientPage";
// import PatientsSearchBar from "./PatientsSearchBar";

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

const PatientsView = ({
  userType,
  setChat,
  setChatterID,
  setChatterName,
  backButton,
  startVideoChat,
  setStage,
  setShowCall
}) => {
  const [patients, setPatients] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [alert, setAlert] = useState(null);
  const [page, setPage] = useState("first");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [showResetButton, setShowResetButton] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const body = {};
    if (searchName !== "") {
      body["name"] = searchName;
      const response = await axios.get("/viewmypatientsbyname", {
        params: body,
      });
      // console.log(response.data.filteredPatients)
      if (response.data.success) {
        setPatients(response.data.filteredPatients);
        setShowResetButton(true);
      }
    }
  };

  const filterByAppointment = async (e) => {
    e.preventDefault();
    try {
      console.log("here");
      const response = await axios.get("/filterPatientsByAppointments");
      // console.log(response.data)
      setPatients(response.data.PatientsDetails);
      setShowResetButton(true);
    } catch (error) {
      console.error("Error fetching doctor appointments:", error);
    }
  };

  const handleResetSearchClick = async (e) => {
    e.preventDefault();
    setSearchName("");
    const response = await axios.get("/viewmypatients");
    setPatients(response.data.PatientsDetails);
    setShowResetButton(false);
  };

  const FamilyMembersView = ({ item }) => {
    console.log(item);
    return (
      <>
        {item && (
          <Box>
            <Typography variant="h6" sx={{ padding: "2px", m: "30px" }}>
              Family Members
            </Typography>
            {item &&
              item.familyMembers &&
              item.familyMembers.map((fam) => (
                <Container maxWidth="md" sx={{}}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <List>
                        <FiberManualRecordIcon
                          sx={{ position: "absolute", left: -20, top: 20 }}
                        />
                        <ListItem>
                          <ListItemText secondary={`Name: ${fam.name}`} />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            secondary={`National ID: ${fam.nationalId}`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText secondary={`Age: ${fam.age}`} />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={6}>
                      <List>
                        <ListItem>
                          <ListItemText secondary={`Gender: ${fam.gender}`} />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            secondary={`Relation to Patient: ${fam.relationToPatient}`}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </Container>
              ))}
          </Box>
        )}
      </>
    );
  };

  const handleItemExpand = (item) => {
    setExpandedItem(item.username === expandedItem ? null : item.username);
  };

  const fetchPatients = async () => {
    try {
      if (userType === "doctor") {
        const response = await axios.get("/viewmypatients");
        setPatients(response.data.PatientsDetails);
      } else {
        await axios.get("/getAllPatients").then((res) => {
          setPatients(res.data);
          console.log(res.data);
        });
      }
    } catch (error) {
      console.error("Add Admin error:", error);
    }
  };

  const removePatient = async (patientId) => {
    try {
      const response = await axios.delete("/deletePatient?id=" + patientId);
      if (response.data.success) {
        setAlert(response.data);
        fetchPatients();
      } else
        setAlert({
          title: "Action could not be Completed",
          message: "Try again at a later time",
        });
    } catch (error) {
      console.error("Add Admin error:", error);
    }
  };

  const openChat = (e, doctorId, name) => {
    e.preventDefault();
    setChat(false);
    setChatterID("");
    setChat(true);
    setChatterID(doctorId);
    setChatterName(name);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const closePopup = () => {
    setAlert(null);
  };

  return (
    <>
      {page === "first" ? (
        <Paper style={paperStyle} elevation={3}>
          <Box
            style={{
              width: "100%",
              borderBottom: "2px solid rgba(0, 0, 0, 0.12)",
              boxSizing: "border-box",
              paddingBottom: "15px",
              marginBottom: "15px",
            }}
          >
            <Box display="flex" alignItems="center" padding="12px">
              <TextField
                label="Search"
                variant="outlined"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                margin="dense"
                InputProps={{
                  style: {
                    color: "black",
                    borderBottom: "none",
                  },
                }}
                sx={{ width: "79%" }}
              />
              <Box marginLeft="8px" display="flex">
                <Button
                  variant="outlined"
                  onClick={handleSearch}
                  style={{
                    color: "black",
                    cursor: "pointer",
                    minHeight: "60px",
                  }}
                  sx={{
                    height: "55px",
                    "&:hover": { backgroundColor: "#2196F3", color: "white" },
                  }}
                >
                  Search
                </Button>
                <Button
                  variant="outlined"
                  onClick={filterByAppointment}
                  style={{
                    color: "black",
                    marginLeft: "8px",
                    cursor: "pointer",
                  }}
                  sx={{
                    "&:hover": { backgroundColor: "#2196F3", color: "white" },
                  }}
                >
                  Filter By Upcoming Appointment
                </Button>
                {showResetButton && (
                  <Button
                    variant="outlined"
                    onClick={handleResetSearchClick}
                    style={{
                      color: "black",
                      marginLeft: "8px",
                      cursor: "pointer",
                    }}
                    sx={{
                      "&:hover": { backgroundColor: "#2196F3", color: "white" },
                    }}
                  >
                    Reset Search
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
          <Fab
            onClick={backButton}
            color="primary"
            size="small"
            sx={{
              position: "absolute",
              top: "25%",
              left: "6%",
              transform: "translateY(-50%)",
            }}
          >
            <KeyboardArrowLeftIcon />
          </Fab>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Typography variant="h4" sx={{ m: "30px" }}>
              Patients
            </Typography>
          </Box>

          <List style={listStyle}>
            {patients &&
              patients.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem button onClick={() => handleItemExpand(item)}>
                    <PersonIcon
                      sx={{ mr: "15px", width: "50px", height: "50px" }}
                    />
                    <Container
                      maxWidth="md"
                      sx={{ marginTop: 2, padding: "5px" }}
                    >
                      <Typography variant="h5" sx={{ marginBottom: 2 }}>
                        {item.name}
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <List>
                            <ListItem>
                              <ListItemText
                                primary={`Username: ${item.username}`}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText primary={`Email: ${item.email}`} />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                primary={`Birth Date: ${new Date(
                                  item.birthDate
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}`}
                              />
                            </ListItem>
                          </List>
                        </Grid>
                        <Grid item xs={6}>
                          <List>
                            <ListItem>
                              <ListItemText
                                primary={`Gender: ${item.gender}`}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                primary={`Mobile Number: ${item.mobileNumber}`}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemText
                                primary={`Emergency Contact: ${item.emergencyContact.name}, ${item.emergencyContact.mobileNumber} (${item.emergencyContact.relation})`}
                              />
                            </ListItem>
                          </List>
                        </Grid>
                      </Grid>
                    </Container>
                  </ListItem>
                  <Collapse
                    in={item.username === expandedItem}
                    timeout="auto"
                    unmountOnExit
                  >
                    {item.familyMembers && item.familyMembers.length > 0 && (
                      <FamilyMembersView item={item} />
                    )}
                    {userType === "pharmacist" && (
                      <Button
                        variant="contained"
                        sx={{ m: "30px" }}
                        onClick={(e) => openChat(e, item._id, item.name)}
                      >
                        Chat With Patient
                      </Button>
                    )}
                    {userType === "admin" && (
                      <Button
                        variant="contained"
                        onClick={() => removePatient(item._id)}
                        sx={{ m: "30px" }}
                      >
                        Remove Patient
                      </Button>
                    )}
                    {userType === "doctor" && (
                      <>
                        <Button
                          variant="contained"
                          sx={{ m: "30px" }}
                          onClick={() => {
                            setPage("second");
                            setSelectedPatient(item);
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ m: "30px" }}
                          onClick={(e) => openChat(e, item._id, item.name)}
                        >
                          Chat With Patient
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ m: "30px" }}
                          onClick={(e) => {
                            startVideoChat(item._id);
                            setShowCall(true)
                          }}
                        >
                          Video Call Patient
                        </Button>
                      </>
                    )}
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
      ) : (
        <>
          <Fab
            onClick={() => {
              setPage("first");
            }}
            color="primary"
            size="small"
            sx={{
              position: "absolute",
              top: "25%",
              left: "6%",
              transform: "translateY(-50%)",
            }}
          >
            <KeyboardArrowLeftIcon />
          </Fab>
          <PatientPage
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            setAlert={setAlert}
          />
        </>
      )}
      {alert && (
        <Popup
          onClose={() => setAlert(null)}
          title={alert.title}
          message={alert.message}
          showButtons={false}
        />
      )}
    </>
  );
};

export default PatientsView;
