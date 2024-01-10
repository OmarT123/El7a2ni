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
  const [followupExpanded, setFollowupExpanded] = useState(false);
  const [rescheduleExpanded, setRescheduleExpanded] = useState(false);

  const handleRescheduleExpand = (item) => {
    setRescheduleExpanded(
      item._id.toString() === rescheduleExpanded ? null : item._id
    );
    setFollowupExpanded(false);
    setAddAppointmentExpanded(false);
  };

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
    setFollowupExpanded(false);
    setRescheduleExpanded(false);
  };

  const handleFollowupExpand = (item) => {
    setFollowupExpanded(
      item._id.toString() === followupExpanded ? null : item._id
    );
    setAddAppointmentExpanded(false);
    setRescheduleExpanded(false);
  };

  const createFreeAppointment = async (e, id) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      setAlert({
        title: "Insufficient Data",
        message: "Please provide both Date and Time",
      });
      return;
    }
    let newAppointment = {};

    const baseTime = new Date(`2000-01-01T${selectedTime}:00.000Z`);
    const newTime = new Date(baseTime.getTime() + 60 * 60 * 1000);
    const formattedNewTime = newTime.toISOString().substr(11, 5);
    // console.log(formattedNewTime);
    // if (formattedNewTime)return

    if (id) {
      newAppointment = {
        date: selectedDate,
        time: formattedNewTime,
        patientID: id,
      };
    } else {
      newAppointment = {
        date: selectedDate,
        time: formattedNewTime,
      };
    }
    try {
      const response = await axios.post("/addAppointmentSlots", newAppointment);
      const result = response.data;

      setAlert(result);
      fetchAppointments();
      // Clear selected date and time
      setAddAppointmentExpanded(false);
      setSelectedDate("");
      setSelectedTime("");
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  const updateAvailableTimes = async (e) => {
    e.preventDefault();
    setSelectedDate(e.target.value);
    console.log(e.target.value);
    const inputDate = e.target.value;
    const currentDate = new Date();

    const inputDateTime = new Date(`${inputDate}T00:00:00.000Z`);
    if (inputDateTime <= currentDate) {
      setSelectedDate(null);
      setAlert({
        title: "Cant Reserve",
        message: "You can only reserve dates in the future",
      });
      return;
    }
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

    const response = await axios.get("/filterAppointmentsForDoctor", {
      status: "",
      date: "",
    });
    if (!response.data.success) {
      setAvailableTimes(allTimes);
      return;
    }
    const apps = response.data.appointmentData;
    // console.log(apps)
    // console.log(apps);
    // Extract existing times for the selected date
    const upcoming = apps.upcomingAppointments
      .filter(
        (appointment) => appointment.date.substr(0, 10) === e.target.value
      )
      .map((appointment) => appointment.date.substr(11, 5));
    const free = apps.freeAppointments
      .filter(
        (appointment) => appointment.date.substr(0, 10) === e.target.value
      )
      .map((appointment) => appointment.date.substr(11, 5));

    console.log("done");
    // console.log(upcoming, free);
    // Generate available times

    const availableTimes1 = allTimes.filter((time) => !upcoming.includes(time));
    // console.log(availableTimes1);
    const availableTimes2 = availableTimes1.filter(
      (time) => !free.includes(time)
    );
    // console.log(availableTimes2);

    setAvailableTimes(availableTimes2);
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
    console.log(response.data);
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

  const rescheduleAppointment = async (e, id) => {
    e.preventDefault();
    // console.log(selectedDate, selectedTime)
    // if (selectedDate)return
    const baseTime = new Date(`2000-01-01T${selectedTime}:00.000Z`);
    const newTime = new Date(baseTime.getTime() + 60 * 60 * 1000);
    const formattedNewTime = newTime.toISOString().substr(11, 5);
    try {
      const response = await axios.put("/rescheduleAppointmentForPatient", {
        appointmentId: id,
        newDate: `${selectedDate}T${selectedTime}:00.000Z`,
      });
      //   console.log(response.data)
      setAlert({ title: "Appointment Rescheduled" });
      fetchAppointments();
    } catch (error) {
      setAlert(error.response?.data?.message || error.message);
    }
  };

  const cancelAppointment = async (e, appointmentID) => {
    e.preventDefault();
    const response = await axios.put("/cancelAppointment", {
      appointmentID: appointmentID,
    });
    console.log(response.data);
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
            <Box marginLeft="8px" display="flex" sx={{ width: "20%" }}>
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
            sx={{ display: alert ? "none" : "" }}
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
                sx={{ width: "40%", my: 3, mr: "5%" }}
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
                    sx={{ width: "40%", height: "80%" }}
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
                              primary={`Attendant Name: ${
                                item.attendantName || "NOT RESERVED"
                              }`}
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
                          <ListItem>
                            <ListItemText
                              primary={`Time: ${item.date.substr(11, 5)}`}
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
                        onClick={() => handleRescheduleExpand(item)}
                      >
                        Reschedule Appointment
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ m: "30px" }}
                        onClick={(e) => cancelAppointment(e, item._id)}
                      >
                        Cancel Appointment
                      </Button>
                      <Collapse
                        in={item._id.toString() === rescheduleExpanded}
                        timeout="auto"
                        unmountOnExit
                      >
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
                              sx={{ width: "40%", my: 3, mr: "5%" }}
                            />
                            <Box sx={{ width: "1%" }} />
                            {selectedDate && (
                              <>
                                <InputLabel id="select-label">
                                  Select Option
                                </InputLabel>
                                <Select
                                  labelId="select-label"
                                  id="select"
                                  value={selectedTime}
                                  label="Select Option"
                                  onChange={(e) =>
                                    setSelectedTime(e.target.value)
                                  }
                                  sx={{ width: "40%", height: "80%" }}
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
                            onClick={(e) => rescheduleAppointment(e, item._id)}
                            sx={{ width: "100%" }}
                          >
                            Reschedule
                          </Button>
                        </Box>
                      </Collapse>
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
                            primary={`Attendant Name: ${
                              item.attendantName || "NOT RESERVED"
                            }`}
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
                        <ListItem>
                          <ListItemText
                            primary={`Time: ${item.date.substr(11, 5)}`}
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
                            primary={`Attendant Name: ${
                              item.attendantName || "NOT RESERVED"
                            }`}
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
                        <ListItem>
                          <ListItemText
                            primary={`Time: ${item.date.substr(11, 5)}`}
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
                            primary={`Attendant Name: ${
                              item.attendantName || "NOT RESERVED"
                            }`}
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
                        <ListItem>
                          <ListItemText
                            primary={`Time: ${item.date.substr(11, 5)}`}
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
                      onClick={() => handleFollowupExpand(item)}
                    >
                      Schedule
                    </Button>
                    <Collapse
                      in={item._id.toString() === followupExpanded}
                      timeout="auto"
                      unmountOnExit
                    >
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
                            sx={{ width: "40%", my: 3, mr: "5%" }}
                          />
                          <Box sx={{ width: "1%" }} />
                          {selectedDate && (
                            <>
                              <InputLabel id="select-label">
                                Select Option
                              </InputLabel>
                              <Select
                                labelId="select-label"
                                id="select"
                                value={selectedTime}
                                label="Select Option"
                                onChange={(e) =>
                                  setSelectedTime(e.target.value)
                                }
                                sx={{ width: "40%", height: "80%" }}
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
                          onClick={(e) =>
                            createFreeAppointment(e, item.patient._id)
                          }
                          sx={{ width: "100%" }}
                        >
                          Schedule Follow Up
                        </Button>
                      </Box>
                    </Collapse>
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
                            primary={`Attendant Name: ${
                              item.attendantName || "NOT RESERVED"
                            }`}
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
                        <ListItem>
                          <ListItemText
                            primary={`Time: ${item.date.substr(11, 5)}`}
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
