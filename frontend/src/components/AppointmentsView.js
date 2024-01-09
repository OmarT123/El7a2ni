import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import axios from "axios";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Typography,
  Fab,
  Collapse,
  TextField,
  InputAdornment,
  Select,
  InputLabel,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Container,
} from "@mui/material";
import Popup from "./Popup";

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

const AppointmentsView = ({ backButton }) => {
  const [cancelledAppointments, setCancelledAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [requestedAppointments, setRequestedAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [freeAppointments, setFreeAppointments] = useState([]);
  const [alert, setAlert] = useState(null);
  const [expandedItem, setExpandedItem] = useState("");
  const [addAppointmentExpanded, setAddAppointmentExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showResetButton, setShowResetButton] = useState(false);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("/viewDoctorAppointments");
      setUpcomingAppointments(response.data.upcomingAppointments);
      setCancelledAppointments(response.data.pastAppointments);
      setRequestedAppointments(response.data.requestedAppointments);
      setCompletedAppointments(response.data.completedAppointments);
      setFreeAppointments(response.data.freeAppointments);
    } catch (error) {
      console.error("Error fetching doctor appointments:", error);
    }
  };

  const handleItemExpand = (item) => {
    setExpandedItem(item._id.toString() === expandedItem ? null : item._id);
  };

  const createFreeAppointment = () => {};

  const updateAvailableTimes = async (e) => {
    e.preventDefault();
    setSelectedDate(e.target.value);
    const response = await axios.get("/filterAppointmentsForDoctor", {
      status: "",
      date: "",
    });
    const apps = response.data;
    console.log(apps);
    // Extract existing times for the selected date
    // const existingTimes = apps
    //   .filter(
    //     (appointment) => appointment.date.substr(0, 10) === e.target.value
    //   )
    //   .map((appointment) => appointment.date.substr(11, 5));

    // Generate available times
    const allTimes = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
    ];
    // const availableTimes = allTimes.filter(
    //   (time) => !existingTimes.includes(time)
    // );

    setAvailableTimes(availableTimes);
  };

  const filterAppointments = async (e) => {
    e.preventDefault();
    const filterData = {};
    if (filterStatus !== "") filterData["status"] = filterStatus;
    if (filterDate !== "") filterData["date"] = filterDate;

    try {
      const response = await axios.get("/filterAppointmentsForDoctor", {
        params: filterData,
      });
      if (response.data.success) {
        setRequestedAppointments(
          response.data.appointmentData.requestedAppointments
        );
        setCancelledAppointments(
          response.data.appointmentData.cancelledAppointments
        );
        setUpcomingAppointments(
          response.data.appointmentData.upcomingAppointments
        );
        setCompletedAppointments(
          response.data.appointmentData.completedAppointments
        );
        setFreeAppointments(response.data.appointmentData.freeAppointments);
      } else {
        setAlert(response.data);
        setRequestedAppointments([]);
        setCancelledAppointments([]);
        setUpcomingAppointments([]);
        setCompletedAppointments([]);
        setFreeAppointments([]);
      }
      setShowResetButton(true);
    } catch (error) {
      // Handle error
    }
  };

  const acceptRequest = async (e, appointmentID) => {
    e.preventDefault();
    const response = await axios.put("/approveRequest", {
      appointmentID: appointmentID,
    });
    if (response.data.success) {
      setAlert(response.data);
      fetchAppointments();
    } else {
      setAlert({
        title: "Something went Wrong",
        message: "Please try again at a later time",
      });
    }
  };

  const handleResetSearchClick = async (e) => {
    e.preventDefault();
    setFilterDate("");
    setFilterStatus("");
    fetchAppointments();
    setShowResetButton(false);
  };

  const rescheduleAppointment = () => {};

  const cancelAppointment = async (e, appointmentID) => {
    e.preventDefault();
    const response = await axios.put("/cancelAppointment", {
      appointmentID: appointmentID,
    });
    if (response.data.success) {
      setAlert(response.data);
      fetchAppointments();
    } else {
      setAlert({
        title: "Something went Wrong",
        message: "Please try again at a later time",
      });
    }
  };

  const scheduleFollowup = () => {};

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <>
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
              id="date"
              label="Date"
              type="date"
              placeholder="Date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ width: "40%", my: 3, mr: "5%" }}
            />
            <InputLabel id="select-label">Status</InputLabel>
            <Select
              labelId="select-label"
              id="status"
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ width: "30%" }}
            >
              <MenuItem value={"upcoming"}>Upcoming</MenuItem>
              <MenuItem value={"free"}>Free</MenuItem>
              <MenuItem value={"requested"}>Requested</MenuItem>
              <MenuItem value={"completed"}>Completed</MenuItem>
              <MenuItem value={"cancelled"}>Cancelled</MenuItem>
            </Select>
            <Box marginLeft="8px" display="flex" sx={{width:'20%'}}>
              <Button
                variant="outlined"
                onClick={filterAppointments}
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
                Filter Appointments
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
            Appointments
          </Typography>
          <Fab
            style={buttonStyle}
            onClick={() => setAddAppointmentExpanded((prev) => !prev)}
          >
            {addAppointmentExpanded ? (
              <ClearIcon style={iconStyle} />
            ) : (
              <AddIcon style={iconStyle} />
            )}
          </Fab>
        </Box>
        <Collapse in={addAppointmentExpanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <TextField
                id="date"
                label="Date"
                type="date"
                placeholder="Date"
                value={selectedDate}
                onChange={updateAvailableTimes}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ width: "50%", my: 3, mr: "5%" }}
              />
              <Box sx={{ width: "1%" }} />
              {selectedDate && (
                <>
                  <InputLabel id="select-label">Select Option</InputLabel>
                  <Select
                    labelId="select-label"
                    id="select"
                    value={selectedTime}
                    label="Select Option"
                    onChange={(e) => setSelectedTime(e.target.value)}
                    sx={{ width: "45%" }}
                  >
                    {availableTimes.map((time) => (
                      <MenuItem value={time}>{time}</MenuItem>
                    ))}
                  </Select>
                </>
              )}
            </Box>
            <Button
              variant="contained"
              onClick={createFreeAppointment}
              sx={{ width: "100%" }}
            >
              Create Appointment
            </Button>
          </Box>
        </Collapse>

        {upcomingAppointments.length > 0 && (
          <>
            <Typography variant="h5" sx={{ m: "30px" }}>
              Upcoming
            </Typography>
            <List style={listStyle}>
              {upcomingAppointments &&
                upcomingAppointments.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem button onClick={() => handleItemExpand(item)}>
                      <PendingActionsIcon
                        sx={{ mr: "15px", width: "50px", height: "50px" }}
                      />
                      <Container
                        maxWidth="md"
                        sx={{ marginTop: 2, padding: "5px" }}
                      >
                        <Typography
                          variant="h5"
                          sx={{ marginBottom: 2 }}
                        >{`Appointment ${index + 1}:`}</Typography>
                        <List>
                          <ListItem>
                            <ListItemText
                              primary={`Attendant Name: ${item.attendantName}`}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary={`Date: ${new Date(
                                item.date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}`}
                            />
                          </ListItem>
                        </List>
                      </Container>
                    </ListItem>
                    <Collapse
                      in={item._id.toString() === expandedItem}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Button
                        variant="contained"
                        sx={{ m: "30px" }}
                        onClick={rescheduleAppointment}
                      >
                        Reschedule Appointmetn
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ m: "30px" }}
                        onClick={(e) => cancelAppointment(e, item._id)}
                      >
                        Cancel Appointment
                      </Button>
                    </Collapse>
                  </React.Fragment>
                ))}
            </List>
          </>
        )}

        {freeAppointments.length > 0 && (
          <>
            <Typography variant="h5" sx={{ m: "30px" }}>
              Free
            </Typography>
            <List style={listStyle}>
              {freeAppointments.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem button onClick={() => handleItemExpand(item)}>
                    <PendingActionsIcon
                      sx={{ mr: "15px", width: "50px", height: "50px" }}
                    />
                    <Container
                      maxWidth="md"
                      sx={{ marginTop: 2, padding: "5px" }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ marginBottom: 2 }}
                      >{`Appointment ${
                        index + 1 + upcomingAppointments.length
                      }:`}</Typography>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary={`Attendant Name: ${item.attendantName}`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary={`Date: ${new Date(
                              item.date
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}`}
                          />
                        </ListItem>
                      </List>
                    </Container>
                  </ListItem>
                  <Collapse
                    in={item._id.toString() === expandedItem}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Button
                      variant="contained"
                      sx={{ m: "30px" }}
                      onClick={(e) => cancelAppointment(e, item._id)}
                    >
                      Remove Slot
                    </Button>
                  </Collapse>
                </React.Fragment>
              ))}
            </List>
          </>
        )}

        {requestedAppointments.length > 0 && (
          <>
            <Typography variant="h5" sx={{ m: "30px" }}>
              Requested
            </Typography>
            <List style={listStyle}>
              {requestedAppointments.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem button onClick={() => handleItemExpand(item)}>
                    <PendingActionsIcon
                      sx={{ mr: "15px", width: "50px", height: "50px" }}
                    />
                    <Container
                      maxWidth="md"
                      sx={{ marginTop: 2, padding: "5px" }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ marginBottom: 2 }}
                      >{`Appointment ${
                        index +
                        1 +
                        upcomingAppointments.length +
                        freeAppointments.length
                      }:`}</Typography>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary={`Attendant Name: ${item.attendantName}`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary={`Date: ${new Date(
                              item.date
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}`}
                          />
                        </ListItem>
                      </List>
                    </Container>
                  </ListItem>
                  <Collapse
                    in={item._id.toString() === expandedItem}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Button
                      variant="contained"
                      sx={{ m: "30px" }}
                      onClick={(e) => acceptRequest(e, item._id)}
                    >
                      Accept Request
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ m: "30px" }}
                      onClick={(e) => cancelAppointment(e, item._id)}
                    >
                      Reject Request
                    </Button>
                  </Collapse>
                </React.Fragment>
              ))}
            </List>
          </>
        )}

        {completedAppointments.length > 0 && (
          <>
            <Typography variant="h5" sx={{ m: "30px" }}>
              Completed
            </Typography>
            <List style={listStyle}>
              {completedAppointments.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem button onClick={() => handleItemExpand(item)}>
                    <PendingActionsIcon
                      sx={{ mr: "15px", width: "50px", height: "50px" }}
                    />
                    <Container
                      maxWidth="md"
                      sx={{ marginTop: 2, padding: "5px" }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ marginBottom: 2 }}
                      >{`Appointment ${
                        index +
                        1 +
                        upcomingAppointments.length +
                        freeAppointments.length +
                        requestedAppointments.length
                      }:`}</Typography>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary={`Attendant Name: ${item.attendantName}`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary={`Date: ${new Date(
                              item.date
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}`}
                          />
                        </ListItem>
                      </List>
                    </Container>
                  </ListItem>
                  <Collapse
                    in={item._id.toString() === expandedItem}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Button
                      variant="contained"
                      sx={{ m: "30px" }}
                      onClick={scheduleFollowup}
                    >
                      Schedule Follow Up
                    </Button>
                  </Collapse>
                </React.Fragment>
              ))}
            </List>
          </>
        )}

        {cancelledAppointments.length > 0 && (
          <>
            <Typography variant="h5" sx={{ m: "30px" }}>
              Cancelled
            </Typography>
            <List style={listStyle}>
              {cancelledAppointments.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem button onClick={() => handleItemExpand(item)}>
                    <PendingActionsIcon
                      sx={{ mr: "15px", width: "50px", height: "50px" }}
                    />
                    <Container
                      maxWidth="md"
                      sx={{ marginTop: 2, padding: "5px" }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ marginBottom: 2 }}
                      >{`Appointment ${
                        index +
                        1 +
                        upcomingAppointments.length +
                        freeAppointments.length +
                        requestedAppointments.length +
                        completedAppointments.length
                      }:`}</Typography>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary={`Attendant Name: ${item.attendantName}`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary={`Date: ${new Date(
                              item.date
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}`}
                          />
                        </ListItem>
                      </List>
                    </Container>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
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
      </Paper>
    </>
  );
};

export default AppointmentsView;
