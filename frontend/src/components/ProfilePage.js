import {
  Container,
  Typography,
  Avatar,
  Grid,
  Box,
  Button,
  Collapse,
  TextField,
  InputAdornment,
  IconButton,
  ListItem,
  List,
  ListItemText,
  Fab,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { useState, useEffect } from "react";
import axios from "axios";
import Popup from "./Popup";
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

const ProfilePage = ({ userData }) => {
  const [expandPassword, setExpandPassword] = useState(false);
  const [expandEdit, setExpandEdit] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [alert, setAlert] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [addFamilyMemberExpanded, setAddFamilyMemberExpanded] = useState(false);
  const [name, setName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [relationToPatient, setRelationToPatient] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    relationToPatient: "",
  });
  const [patientRelationToPatient, setPatientRelationToPatient] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const fetchFamilyMembers = async () => {
    const response = await axios.get("/viewAllFamilyMembers");
    setFamilyMembers(response.data);
  };

  const addFamilyMember = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const familyMember = {
      name: data.get("name"),
      nationalId: data.get("nationalId"),
      age: data.get("age"),
      gender,
      relationToPatient,
    };
    const response = await axios.post("/addFamilyMember", familyMember);
    setAlert({ title: "Family Member Created Successfully" });
    fetchFamilyMembers();
    // setMessage(response.data);
    // handleClick();
  };

  const linkPatientAccount = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData(e.currentTarget);
      const formData = {
        phone: data.get("phoneNumber"),
        email: data.get("patientEmail"),
        relationToPatient: patientRelationToPatient,
      };
      const response = await axios.post(`/linkFamilyMember`, formData);
      console.log(response.data);
      fetchFamilyMembers();
      // setSuccessMessa//ge(response.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        // setErrorMe/ssage(error.response.data.error);
      } else {
        // setErr/orMessage("An error occurred while linking family member.");
      }
    }
  };

  useEffect(() => {
    if (userData.familyMembers) fetchFamilyMembers();
  }, []);

  const editDetails = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const newData = {};
    if (data.get("email")) newData["email"] = data.get("email");
    if (data.get("hourlyRate")) newData["hourlyRate"] = data.get("hourlyRate");
    if (data.get("affiliation"))
      newData["affiliation"] = data.get("affiliation");

    const response = await axios.put("/editDoctor", newData);
    if (response.data.success) {
      setEmail("email");
      setHourlyRate(data.get("hourlyRate"));
      setAffiliation(data.get("affiliation"));
      setAlert(response.data);
      setExpandEdit(false);
    } else {
      setAlert({
        title: "Something went Wrong",
        message: "Please try again at a later time",
      });
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("/changePassword", {
        oldPassword,
        newPassword,
      });
      setAlert(response.data);
      if (response.data.success) setExpandPassword(false);
    } catch (error) {
      console.error("Change Password error:", error);
    }
  };

  return (
    <>
      <Container maxWidth="md" sx={{ height: "100%", marginTop: 15 }}>
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Avatar
            sx={{ width: 200, height: 200 }}
            alt={"Profile"}
            src="profile.jpg"
          />
          <Box sx={{ width: "300px" }} />
          <Grid
            container
            sx={{ width: "1000px" }}
            spacing={3}
            justifyContent="center"
          >
            <Grid item xs={12} sm={12} align="center">
              <Typography variant="h4">
                {userData.name && userData.name.toUpperCase()}
              </Typography>
              <Typography
                variant={userData.name ? "subtitle1" : "h4"}
                sx={{ color: "#555" }}
              >
                {userData.username}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} align="left">
              {userData.email && (
                <Typography variant="subtitle1">
                  <strong>Email:</strong> {userData.email}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6} align="left">
              {userData.birthDate && (
                <Typography variant="subtitle1">
                  <strong>Birthdate:</strong>
                  {new Date(userData.birthDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </Typography>
              )}
            </Grid>
            <Grid item xs={0} sm={12} />
            <Grid item xs={12} sm={6} align="left">
              {userData.phoneNumber && (
                <Typography variant="subtitle1">
                  <strong>Phone Number:</strong> {userData.phoneNumber}
                </Typography>
              )}
              {userData.mobileNumber && (
                <Typography variant="subtitle1">
                  <strong>Phone Number:</strong> {userData.mobileNumber}
                </Typography>
              )}
              {userData.hourlyRate && (
                <Typography variant="subtitle1">
                  <strong>Hourly Rate:</strong> {userData.hourlyRate}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={6} align="left">
              {userData.wallet >= 0 && (
                <Typography variant="subtitle1">
                  <strong>Wallet:</strong> ${userData.wallet}
                </Typography>
              )}
            </Grid>
            <Grid item sm={12} />
            <Grid
              item
              xs={12}
              sm={userData.emergencyContact ? 12 : 6}
              align={userData.emergencyContact ? "center" : "left"}
            >
              {userData.emergencyContact && (
                <Typography variant="subtitle1">
                  <strong>Emergency Contact:</strong>{" "}
                  {userData.emergencyContact.name} (
                  {userData.emergencyContact.relation})
                </Typography>
              )}
              {userData.affiliation && (
                <Typography variant="subtitle1">
                  <strong>Affiliation:</strong> {userData.affiliation}
                </Typography>
              )}
            </Grid>
            <Grid item xs={0} sm={6} />
            {userData.speciality && (
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setExpandEdit((prev) => !prev);
                    setExpandPassword(false);
                  }}
                >
                  Edit Details
                </Button>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                onClick={() => {
                  setExpandPassword((prev) => !prev);
                  setExpandEdit(false);
                }}
              >
                Change Password
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Collapse in={expandPassword} timeout="auto" unmountOnExit>
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Old Password"
                variant="outlined"
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                sx={{ marginBottom: "10px" }}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowOldPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showOldPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="New Password"
                variant="outlined"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ marginBottom: "10px" }}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showNewPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button variant="contained" onClick={changePassword}>
                Save Password
              </Button>
            </Grid>
          </Grid>
        </Collapse>
        {familyMembers.length > 0 && (
          <>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Typography variant="h5">Family Members</Typography>
              <Fab
                style={buttonStyle}
                onClick={() => setAddFamilyMemberExpanded((prev) => !prev)}
                sx={{
                  display: alert ? "none" : "",
                  position: "absolute",
                  bottom: 60,
                  left: 520,
                }}
              >
                {addFamilyMemberExpanded ? (
                  <ClearIcon style={iconStyle} />
                ) : (
                  <AddIcon style={iconStyle} />
                )}
              </Fab>
            </Box>
            <Collapse in={addFamilyMemberExpanded} timeout="auto" unmountOnExit>
              <Grid container spacing={4}>
                <Grid item sm={6}>
                  <Box component="form" noValidate onSubmit={addFamilyMember}>
                    <Grid container spacing={3} sx={{ mt: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Name"
                          name="name"
                          id="name"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Age"
                          type="number"
                          name="age"
                          id="age"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel id="gender-label">Gender</InputLabel>
                        <Select
                          fullWidth
                          labelId="gender-label"
                          id="gender"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          label="Select Gender"
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel id="realtion-label">
                          Relation To Patient
                        </InputLabel>
                        <Select
                          fullWidth
                          labelId="relation-label"
                          id="relation"
                          value={relationToPatient}
                          onChange={(e) => setRelationToPatient(e.target.value)}
                          label="Select Relation"
                        >
                          <MenuItem value="husband">Husband</MenuItem>
                          <MenuItem value="wife">Wife</MenuItem>
                          <MenuItem value="daughter">Daughter</MenuItem>
                          <MenuItem value="son">Son</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="NationalId"
                          name="nationalId"
                          id="nationalId"
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Button variant="contained" type="submit">
                          Add Family Member
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item sm={6}>
                  <Box
                    component="form"
                    noValidate
                    onSubmit={linkPatientAccount}
                  >
                    <Grid container spacing={3} sx={{ mt: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="patientEmail"
                          id="patientEmail"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          type="number"
                          name="phoneNumber"
                          id="phoneNumber"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputLabel id="realtion-label">
                          Relation To Patient
                        </InputLabel>
                        <Select
                          fullWidth
                          labelId="relation-label"
                          id="relation"
                          value={patientRelationToPatient}
                          onChange={(e) =>
                            setPatientRelationToPatient(e.target.value)
                          }
                          label="Select Relation"
                        >
                          <MenuItem value="husband">Husband</MenuItem>
                          <MenuItem value="wife">Wife</MenuItem>
                          <MenuItem value="daughter">Daughter</MenuItem>
                          <MenuItem value="son">Son</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Button variant="contained" type="submit">
                          Link Patient
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Collapse>
            <Grid container spacing={3}>
              {familyMembers.map((fm) => (
                <Grid item sm={4}>
                  <List>
                    <ListItem>
                      <ListItemText primary={`Name: ${fm.name}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Age: ${fm.age}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Gender: ${fm.gender}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`National ID: ${fm.nationalId}`} />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary={`Relation: ${fm.relationToPatient}`}
                      />
                    </ListItem>
                  </List>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
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

export default ProfilePage;
