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
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import Popup from "./Popup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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
              {userData.wallet && (
                <Typography variant="subtitle1">
                  <strong>Wallet:</strong> ${userData.wallet }
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
        <Collapse in={expandEdit} timeout="auto" unmountOnExit>
          <Box component="form" noValidate onSubmit={editDetails}>
            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth name="email" label="Email" id="email" />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  name="hourlyRate"
                  label="Hourly Rate"
                  id="hourlyRate"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Affiliation"
                  name="affiliation"
                  id="afilliation"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Button variant="contained" type="submit">
                  Save Details
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
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
