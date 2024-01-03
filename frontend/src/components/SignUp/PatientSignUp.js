import React, { useState, useEffect, useNavigate } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControl";
import Popup from "../Popup";
import { Typography, Fab } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const PatientSignUp = () => {
  const [stage, setStage] = useState("first");
  const [alert, setAlert] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emergencyContact, setEmergencyContact] = useState({});
  const [nationalId, setNationalID] = useState("");

  //   const navigate = useNavigate();

  const FirstStage = () => {
    return (
      <Box
        component="form"
        noValidate
        onSubmit={handleFirstSubmit}
        sx={{ mt: 3 }}
      >
        <Typography variant="h5">Patient Registration</Typography>
        <br></br>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              name="firstName"
              required
              fullWidth
              id="firstName"
              label="First Name"
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
            />
          </Grid>
          {/* <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Continue {"->"}
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const handleFirstSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setName(data.get("firstName") + " " + data.get("lastName"));
    setEmail(data.get("email"));
    setPassword(data.get("password"));
    setUsername(data.get("username"));
    if (
      !data.get("username") ||
      !data.get("password") ||
      !data.get("email") ||
      !data.get("firstName") ||
      !data.get("lastName")
    )
      setAlert({ title: "Incomplete Data", message: "Please fill all fields" });
    else setStage("second");
  };

  const SecondStage = () => {
    return (
      <Box
        component="form"
        noValidate
        onSubmit={handleSecondSubmit}
        sx={{ mt: 3 }}
      >
        <Fab
          onClick={() => setStage("first")}
          color="primary"
          size="small"
          sx={{
            position: "absolute",
            top: "23%",
            left: "37%",
            transform: "translateY(-50%)",
          }}
        >
          <KeyboardArrowLeftIcon />
        </Fab>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="birthDate"
              label="Birth Date"
              type="date"
              placeholder="Birth Date"
              required
              name="birthDate"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* <InputLabel id="dropdown-label">Gender</InputLabel> */}
            <Select
              labelId="dropdown-label"
              id="gender"
              label="Gender"
              name="gender"
              required
              sx={{ width: "100%" }}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="mobileNumber"
              label="Mobile Number"
              name="mobileNumber"
              autoComplete="mobileNumber"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="nationalId"
              label="National ID"
              id="nationalId"
              autoComplete="nationalId"
            />
          </Grid>
          {/* <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Continue {"->"}
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="/link" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const handleSecondSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBirthDate(data.get("birthDate"));
    setNationalID(data.get("nationalId"));
    setGender(data.get("gender"));
    setMobileNumber(data.get("mobileNumber"));
    if (
      !data.get("birthDate") ||
      !data.get("nationalId") ||
      !data.get("gender") ||
      !data.get("mobileNumber")
    )
      setAlert({ title: "Incomplete Data", message: "Please fill all fields" });
    else setStage("third");
  };

  const ThirdStage = () => {
    return (
      <Box
        component="form"
        noValidate
        onSubmit={handleThirdSubmit}
        sx={{ mt: 3 }}
      >
        <Typography variant="h5">Emergency Contact</Typography>
        <Fab
          onClick={() => setStage("second")}
          color="primary"
          size="small"
          sx={{
            position: "absolute",
            top: "23%",
            left: "37%",
            transform: "translateY(-50%)",
          }}
        >
          <KeyboardArrowLeftIcon />
        </Fab>
        <br></br>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="emergencyName"
              label="Name"
              name="emergencyName"
              autoComplete="emergencyName"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* <InputLabel id="dropdown-label">Gender</InputLabel> */}
            <TextField
              required
              fullWidth
              id="emergencyMobileNumber"
              label="Mobile Number"
              name="emergencyMobileNumber"
              autoComplete="emergencyMobileNumber"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              id="emergencyRelation"
              label="Relation"
              name="emergencyRelation"
              required
              sx={{ width: "100%" }}
            >
              <MenuItem value="husband">Husband</MenuItem>
              <MenuItem value="wife">Wife</MenuItem>
              <MenuItem value="son">Son</MenuItem>
              <MenuItem value="daughter">Daughter</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const handleThirdSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const contact = {
      name: data.get("emergencyName"),
      mobileNumber: data.get("emergencyMobileNumber"),
      relation: data.get("emergencyRelation"),
    };
    setEmergencyContact(contact);

    if (
      !data.get("emergencyName") ||
      !data.get("emergencyMobileNumber") ||
      !data.get("emergencyRelation")
    )
      setAlert({ title: "Incomplete Data", message: "Please fill all fields" });
    else {
      try {
        const body = {
          name,
          username,
          email,
          password,
          birthDate,
          gender,
          mobileNumber,
          emergencyContact: contact,
          nationalId,
        };
        await axios.post("/addPatient", body);
        setAlert({ title: "Successfully Registered" });
        setTimeout(() => (window.location.href = "/login"), 2000);
      } catch (error) {
        console.error("Registration error:", error);
      }
    }
  };

  const closePopup = () => {
    setAlert(null);
  };

  return (
    <>
      {stage === "first" ? (
        <FirstStage />
      ) : stage === "second" ? (
        <SecondStage />
      ) : (
        <ThirdStage />
      )}
      {alert && (
        <Popup
          onClose={closePopup}
          title={alert.title}
          message={alert.message}
          showButtons={false}
        />
      )}
    </>
  );
};

export default PatientSignUp;
