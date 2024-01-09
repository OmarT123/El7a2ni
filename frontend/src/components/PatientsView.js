import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import { Button, TextField, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
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

const PatientsView = ({ userType, setChat, setChatterID, setChatterName }) => {
  const [patients, setPatients] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [alert, setAlert] = useState(null);

  const FamilyMembersView = ({ item }) => {
    return (
      <Box>
        <Typography variant="h6" sx={{ padding: "2px" }}>
          Family Members
        </Typography>
        {item.familyMembers.map((fam) => (
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
    );
  };

  const handleItemExpand = (item) => {
    setExpandedItem(item.username === expandedItem ? null : item.username);
  };

  const fetchPatients = async () => {
    try {
      await axios.get("/getAllPatients").then((res) => {
        setPatients(res.data);
      });
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
    setChatterID('');
    setChat(true);
    setChatterID(doctorId);
    setChatterName(name);
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  const closePopup = () => {
    setAlert(null);
  };

  return (
    <>
      <Paper style={paperStyle} elevation={3}>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Typography variant="h4" sx={{ m: "30px" }}>
            Patients
          </Typography>
        </Box>

        <List style={listStyle}>
          {patients.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem button onClick={() => handleItemExpand(item)}>
                <PersonIcon
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
                          <ListItemText primary={`Gender: ${item.gender}`} />
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

export default PatientsView;
