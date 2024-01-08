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

const PharmacistsStage = ({ setAlert, setStage }) => {
  const [unapprovedPharmacists, setUnapprovedPharmacists] = useState([]);
  const [approvedPharmacists, setApprovedPharmacists] = useState([]);

  const fetchPharmacists = async () => {
    const response = await axios.get("/getAllPharmacists");
    if (response.data.success) {
      setUnapprovedPharmacists(response.data.unapproved);
      setApprovedPharmacists(response.data.approved);
    }
  };

  const removePharmacist = async (e, pharmacistId) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        "/deletePharmacist?id=" + pharmacistId
      );
      if (response.data.success) {
        setAlert(response.data);
        fetchPharmacists();
      } else
        setAlert({
          title: "Action could not be Completed",
          message: "Try again at a later time",
        });
    } catch (error) {
      console.error(error);
    }
  };

  const acceptPharmacist = async (e, id) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "/acceptPharmacist?pharmacistId=" + id.toString()
      );
      setAlert(response.data);
      if (response.data.success) {
        fetchPharmacists();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const rejectPharmacist = async (e, id) => {
    e.preventDefault();
    try {
      const response = await axios.put("/rejectPharmacist?pharmacistId=" + id);
      if (response.data.success) {
        setAlert(response.data);
        fetchPharmacists();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const PharmacistListItem = ({ item }) => {
    const [expandedItem, setExpandedItem] = useState(null);
    const [selectedPharmacist, setSelectedPharmacist] = useState(null);
    const [idPDF, setIdPDF] = useState(false);
    const [licensePDF, setLicensePDF] = useState(false);
    const [degreePDF, setDegreePDF] = useState(false);

    const handleItemExpand = async(item) => {
      setExpandedItem(item.username === expandedItem ? null : item.username);
      setIdPDF(false);
      setLicensePDF(false);
      setDegreePDF(false);
      console.log('function')
      if (
        selectedPharmacist &&
        (selectedPharmacist.username === item.username ||
          selectedPharmacist.status !== "pending")
      )
        return;
      const response = await axios.get("/getUnapprovedPharmacists");
      console.log(response.data)
      if (response.data.success) {
        console.log(response.data.pharmacistsWithDocuments);
        const pharmacistWithDocs = response.data.pharmacistsWithDocuments.find(
          (ph) => pharmacistWithDocs.username === item.username
        );
        console.log(pharmacistWithDocs)
        setSelectedPharmacist(pharmacistWithDocs)
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
          <Button
            variant="contained"
            onClick={(e) => removePharmacist(e, item._id)}
            sx={{ m: "30px" }}
          >
            Remove Pharmacist
          </Button>
          {item.status === "pending" && (
            <>
              <Button
                variant="contained"
                sx={{ m: "30px" }}
                onClick={() => {
                  setIdPDF(true);
                  setDegreePDF(false);
                  setLicensePDF(false);
                }}
              >
                View ID
              </Button>
              <Button
                variant="contained"
                sx={{ m: "30px" }}
                onClick={() => {
                  setIdPDF(false);
                  setDegreePDF(true);
                  setLicensePDF(false);
                }}
              >
                View Degree
              </Button>
              <Button
                variant="contained"
                sx={{ m: "30px" }}
                onClick={() => {
                  setIdPDF(false);
                  setDegreePDF(false);
                  setLicensePDF(true);
                }}
              >
                View License
              </Button>

              <Button
                variant="contained"
                onClick={(e) => acceptPharmacist(e, item._id)}
                sx={{ m: "30px" }}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                onClick={(e) => rejectPharmacist(e, item._id)}
                sx={{ m: "30px" }}
              >
                Reject
              </Button>
            </>
          )}
          <Collapse
            in={idPDF || licensePDF || degreePDF}
            timeout="auto"
            unmountOnExit
          >
            {idPDF && (
              <iframe
                title="PDF Viewer"
                src={selectedPharmacist.idPDF}
                width="90%"
                height="600px"
              />
            )}
            {licensePDF && (
              <iframe
                title="PDF Viewer"
                src={selectedPharmacist.degreePDF}
                width="90%"
                height="600px"
              />
            )}
            {degreePDF && (
              <iframe
                title="PDF Viewer"
                src={selectedPharmacist.licensePDF}
                width="90%"
                height="600px"
              />
            )}
          </Collapse>
        </Collapse>
      </React.Fragment>
    );
  };

  useEffect(() => {
    fetchPharmacists();
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
          Pharmacists
        </Typography>

        <Typography variant="h5" sx={{ ml: "30px" }}>
          Unapproved
        </Typography>
        <List style={listStyle}>
          {unapprovedPharmacists.map((item, index) => (
            <PharmacistListItem item={item} key={index} />
          ))}
        </List>

        <Typography variant="h5" sx={{ ml: "30px" }}>
          Approved
        </Typography>
        <List style={listStyle}>
          {approvedPharmacists.map((item, index) => (
            <PharmacistListItem item={item} key={index} />
          ))}
        </List>
      </Paper>
    </>
  );
};
export default PharmacistsStage;
