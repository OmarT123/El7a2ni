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
import { Container, Grid } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const paperStyle = {
  width: "1200px",
  margin: "auto",
  padding: 16,
  marginTop: "30px",
};

const listStyle = {
  marginTop: 16,
};

const DoctorsStage = ({ setAlert, setStage, together = false, userType, setChat, setChatterID, setChatterName }) => {
  const [unapprovedDoctors, setUnapprovedDoctors] = useState([]);
  const [approvedDoctors, setApprovedDoctors] = useState([]);

  const fetchDoctors = async () => {
    const response = await axios.get("/getAllDoctors");
    if (response.data.success) {
      setUnapprovedDoctors(response.data.unapproved);
      setApprovedDoctors(response.data.approved);
    }
  };

  const removeDoctor = async (e, doctorId) => {
    e.preventDefault();
    try {
      const response = await axios.delete("/deleteDoctor?id=" + doctorId);
      if (response.data.success) {
        setAlert(response.data);
        fetchDoctors();
      } else
        setAlert({
          title: "Action could not be Completed",
          message: "Try again at a later time",
        });
    } catch (error) {
      console.error(error);
    }
  };
  const acceptDoctor = async (e, id) => {
    e.preventDefault();
    try {
      const response = await axios.put("/acceptDoctor?doctorId=" + id);
      if (response.data.success) {
        setAlert(response.data);
        fetchDoctors();
      } else
        setAlert({
          title: "Action could not be Completed",
          message: "Try again at a later time",
        });
    } catch (error) {
      console.error(error.message);
    }
  };

  const rejectDoctor = async (e, id) => {
    e.preventDefault();
    try {
      const response = await axios.put("/rejectDoctor?doctorId=" + id);
      if (response.data.success) {
        setAlert(response.data);
        fetchDoctors();
      } else
        setAlert({
          title: "Action could not be Completed",
          message: "Try again at a later time",
        });
    } catch (error) {
      console.error(error.message);
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

  const DoctorListItem = ({ item }) => {
    const [expandedItem, setExpandedItem] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [idPDF, setIdPDF] = useState(false)
    const [licensePDF, setLicensePDF] = useState(false)
    const [degreePDF, setDegreePDF] = useState(false)

    const handleItemExpand = async (item) => {
      setExpandedItem(item.username === expandedItem ? null : item.username);
      setIdPDF(false)
      setLicensePDF(false)
      setDegreePDF(false)
      if (
        selectedDoctor &&
        (selectedDoctor.username === item.username ||
          selectedDoctor.status !== "pending")
      )
        return;
      const response = await axios.get("/viewDocInfo");
      if (response.data.success) {
        // console.log(response.data.doctorsWithDocuments);
        const doctorWithDocs = response.data.doctorsWithDocuments.find(
          (doc) => doc.username === item.username
        );
        setSelectedDoctor(doctorWithDocs)
      }
    };
    return (
      <React.Fragment>
        <ListItem button onClick={() => handleItemExpand(item)}>
          <LocalHospitalIcon
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
                    <ListItemText primary={`Username: ${item.username}`} />
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
                  <ListItem>
                    <ListItemText primary={`Hourly Rate: ${item.hourlyRate}`} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={6}>
                <List>
                  <ListItem>
                    <ListItemText
                      primary={`Affiliation: ${item.affiliation}`}
                    />
                  </ListItem>
                  {item.educationalBackground && (
                    <ListItem>
                      <ListItemText
                        primary={`Educational Background: ${item.educationalBackground.join(
                          ", "
                        )}`}
                      />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemText primary={`Status: ${item.status}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`Speciality: ${item.specilaity}`} />
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
          {(userType === "pharmacist" || userType === "patient") && (
            <Button 
            variant="contained" 
            sx={{ m: "30px" }}
            onClick={(e) => openChat(e, item._id, item.name)}
            >
              Chat With Doctor
            </Button>
          )}
          {userType === "admin" && (
            <Button
              variant="contained"
              onClick={(e) => removeDoctor(e, item._id)}
              sx={{ m: "30px" }}
            >
              Remove Doctor
            </Button>
          )}
          {item.status === "pending" && userType === "admin" && (
            <>
              <Button variant="contained" sx={{ m: "30px" }} onClick={()=>{setIdPDF(true);setDegreePDF(false);setLicensePDF(false)}}>
                View ID
              </Button>
              <Button variant="contained" sx={{ m: "30px" }} onClick={()=>{setIdPDF(false);setDegreePDF(true);setLicensePDF(false)}}>
                View Degree
              </Button>
              <Button variant="contained" sx={{ m: "30px" }} onClick={()=>{setIdPDF(false);setDegreePDF(false);setLicensePDF(true)}}>
                View License
              </Button>

              <Button
                variant="contained"
                onClick={(e) => acceptDoctor(e, item._id)}
                sx={{ m: "30px" }}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                onClick={(e) => rejectDoctor(e, item._id)}
                sx={{ m: "30px" }}
              >
                Reject
              </Button>
            </>
          )}
          <Collapse in={idPDF || licensePDF || degreePDF  }
          timeout="auto"
          unmountOnExit>
            {idPDF  && <iframe title="PDF Viewer" src={selectedDoctor.idPDF} width="90%" height="600px" />}
            {licensePDF  && <iframe title="PDF Viewer" src={selectedDoctor.degreePDF} width="90%" height="600px" />}
            {degreePDF  && <iframe title="PDF Viewer" src={selectedDoctor.licensePDF} width="90%" height="600px" />}
          </Collapse>
        </Collapse>
      </React.Fragment>
    );
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <>
      <Fab
        onClick={() => setStage("first")}
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
      <Paper style={paperStyle} elevation={3}>
        <Typography
          variant="h4"
          sx={{
            m: "30px",
            pb: "5px",
            borderBottom: "2px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          Doctors
        </Typography>

        {!together && (
          <Typography variant="h5" sx={{ ml: "30px" }}>
            Unapproved
          </Typography>
        )}
        <List style={listStyle}>
          {unapprovedDoctors.map((item, index) => (
            <DoctorListItem item={item} key={index} />
          ))}
        </List>

        {!together && (
          <Typography variant="h5" sx={{ ml: "30px" }}>
            Approved
          </Typography>
        )}
        <List style={listStyle} sx={{ mt: together ? "0" : "30" }}>
          {approvedDoctors.map((item, index) => (
            <DoctorListItem item={item} key={index} />
          ))}
        </List>
      </Paper>
    </>
  );
};
export default DoctorsStage;
