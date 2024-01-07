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
import PersonIcon from "@mui/icons-material/Person";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { AirlineSeatLegroomNormalTwoTone } from "@mui/icons-material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Popup from "./Popup";
import { Container, Grid } from "@mui/material";
import SquareCard from "./SquareCard";
import MedicationIcon from "@mui/icons-material/Medication";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const paperStyle = {
  width: "1200px",
  margin: "auto",
  padding: 16,
  marginTop: "30px",
};

const listStyle = {
  marginTop: 16,
};

const EmployeesView = () => {
  const [stage, setStage] = useState("first");
  const [alert, setAlert] = useState(null);

  const FirstStage = () => {
    return (
      <>
        <Grid container spacing={5} sx={{ minHeight: "100vh" }}>
          <Grid item xs={12} sm={12} />
          <Grid item xs={0} sm={2} />
          <Grid item xs={12} sm={3.5}>
            <SquareCard
              title="DOCTORS"
              body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
              icon={LocalHospitalIcon}
              isLearnMore={false}
              changeFunction={() => setStage("doctors")}
              closeFunction={() => setStage("home")}
            />
          </Grid>
          <Grid item xs={0} sm={1} />
          <Grid item xs={12} sm={3.5}>
            <SquareCard
              title="PHARMACISTS"
              body="Lorem ipsum sit amet consectetur adipiscing elit. Vivamus et erat in lacus convallis sodales."
              icon={LocalHospitalIcon}
              isLearnMore={false}
              changeFunction={() => setStage("pharmacists")}
              closeFunction={() => setStage("home")}
            />
          </Grid>
        </Grid>
      </>
    );
  };

  const PharmacistsStage = () => {
    const [unapprovedPharmacists, setUnapprovedPharmacists] = useState([]);
    const [approvedPharmacists, setApprovedPharmacists] = useState([]);

    const fetchPharmacists = async () => {
      const response = await axios.get("/getAllPharmacists");
      if (response.data.success) {
        setUnapprovedPharmacists(response.data.unapproved);
        setApprovedPharmacists(response.data.approved);
        console.log(response.data.unapproved);
        console.log(response.data.approved);
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

    const PharmacistListItem = ({ item }) => {
      const [expandedItem, setExpandedItem] = useState(null);

      const handleItemExpand = (item) => {
        setExpandedItem(item.username === expandedItem ? null : item.username);
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
                      <ListItemText
                        primary={`Hourly Rate: ${item.hourlyRate}`}
                      />
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
              <Button variant="contained" sx={{ m: "30px" }}>
                  View ID
                </Button>
                <Button variant="contained" sx={{ m: "30px" }}>
                  View Degree
                </Button>
                <Button variant="contained" sx={{ m: "30px" }}>
                  View License
                </Button>
                
                <Button variant="contained" sx={{ m: "30px" }}>
                  Accept
                </Button>
                <Button variant="contained" sx={{ m: "30px" }}>
                  Reject
                </Button>
              </>
            )}
          </Collapse>
        </React.Fragment>
      );
    };

    useEffect(() => {
      fetchPharmacists();
    }, []);

    return (
      <>
        <>
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
            {alert && (
              <Popup
                onClose={() => setAlert(false)}
                title={alert.title}
                message={alert.message}
                showButtons={false}
              />
            )}
          </Paper>
        </>
      </>
    );
  };

  const DocotorsStage = () => {
    return <>doctor</>;
  };

  return (
    <>
      {stage === "first" ? (
        <FirstStage />
      ) : stage === "doctors" ? (
        <DocotorsStage />
      ) : (
        <PharmacistsStage />
      )}
    </>
  );
};

export default EmployeesView;
