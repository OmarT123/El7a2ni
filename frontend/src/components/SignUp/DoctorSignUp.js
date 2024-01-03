import React, { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import InputLabel from "@mui/material/InputLabel";
import Popup from "../Popup";
import { Fab, Input, Typography } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const DoctorSignUp = () => {
  const [stage, setStage] = useState("first");
  const [alert, setAlert] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [hourlyRate, setHourlyRate] = useState(0);
  const [affiliation, setAffiliation] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [education1, setEducation1] = useState("");
  const [education2, setEducation2] = useState("");
  const [education3, setEducation3] = useState("");
  const [idPDF, setidPDF] = useState("");
  const [degreePDF, setDegreePDF] = useState("");
  const [licensePDF, setLicensePDF] = useState("");

  const FirstStage = () => {
    return (
      <Box
        component="form"
        noValidate
        onSubmit={handleFirstSubmit}
        sx={{ mt: 3 }}
      >
        <Typography variant="h5">Doctor Registration</Typography>
        <br></br>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="firstName"
              name="firstName"
              required
              fullWidth
              id="firstName"
              label="First Name"
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
    setFirstName(data.get("firstName"));
    setLastName(data.get("lastName"));
    setUsername(data.get("username"));
    setEmail(data.get("email"));
    setPassword(data.get("password"));
    if (
      !data.get("firstName") ||
      !data.get("lastName") ||
      !data.get("email") ||
      !data.get("username") ||
      !data.get("password")
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
            <TextField
              id="hourlyRate"
              label="Hourly Rate"
              placeholder="Hourly Rate"
              required
              name="hourlyRate"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="affiliation"
              label="Affiliation"
              name="affiliation"
              autoComplete="affiliation"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="speciality"
              label="Speciality"
              id="speciality"
              autoComplete="speciality"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="edu1"
              label="Educational Background"
              id="edu1"
              autoComplete="Educational Background"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="edu2"
              label="Educational Background"
              id="edu2"
              autoComplete="Educational Background"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="edu3"
              label="Educational Background"
              id="edu3"
              autoComplete="Educational Background"
            />
          </Grid>
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

  const handleSecondSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    setBirthDate(data.get("birthDate"));
    setHourlyRate(data.get("hourlyRate"));
    setAffiliation(data.get("affiliation"));
    setSpeciality(data.get("speciality"));
    // console.log(data.get('birthDate') ,data.get('hourlyRate') ,data.get('affiliation') ,data.get('speciality'))
    if (
      !data.get("birthDate") ||
      !data.get("hourlyRate") ||
      !data.get("affiliation") ||
      !data.get("speciality")
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
            <InputLabel htmlFor="inputFile1">
              Upload Identification (ID):
            </InputLabel>
            <Input
              id="inputFile1"
              type="file"
              required
              accept="application/pdf"
              onChange={(e) => convertToBase64("id", 1)}
              style={{ marginTop: "7px" }}
            />
          </Grid>

          <Grid item xs={12}>
            <InputLabel htmlFor="inputFile2">
              Upload Pharmacy Degree:
            </InputLabel>
            <Input
              id="inputFile2"
              type="file"
              required
              accept="application/pdf"
              onChange={(e) => convertToBase64("degree", 2)}
              style={{ marginTop: "7px" }}
            />
          </Grid>

          <Grid item xs={12}>
            <InputLabel htmlFor="inputFile3">
              Upload Working License:
            </InputLabel>
            <Input
              id="inputFile3"
              type="file"
              required
              accept="application/pdf"
              onChange={(e) => convertToBase64("license", 3)}
              style={{ marginTop: "7px" }}
            />
          </Grid>
        </Grid>
        <br></br>
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

    if (!idPDF || !degreePDF || !licensePDF) {
      setAlert({ title: "Incomplete Data", message: "Please fill all fields" });
      return;
    }

    const educationalBackground = [];
    if (education1 !== "") educationalBackground.push(education1);
    if (education2 !== "") educationalBackground.push(education2);
    if (education3 !== "") educationalBackground.push(education3);
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !birthDate ||
      !hourlyRate ||
      !affiliation ||
      !educationalBackground
    )
      setAlert({ title: "Incomplete Data", message: "Please fill all fields" });
    else if (
      idPDF.substring(0, 20) != "data:application/pdf" ||
      degreePDF.substring(0, 20) != "data:application/pdf" ||
      licensePDF.substring(0, 20) != "data:application/pdf"
    ) {
      setAlert({
        title: "Incompatible File Types",
        message: "Please upload your documents in the PDF format only.",
      });
    } else {
      const body = {
        name: firstName + " " + lastName,
        username,
        email,
        password,
        birthDate,
        hourlyRate,
        affiliation,
        educationalBackground,
        speciality,
        idPDF,
        degreePDF,
        licensePDF,
      };
      await axios
        .post("/addDoctor", body)
        .then((res) =>
          setAlert({
            title: res.data.title,
            message: res.data.message,
          }),
          setTimeout(()=>window.location.href='/login', 2000)
        )
        .catch((err) => console.log(err));
    }
  };

  function convertToBase64(type, c) {
    //Read File
    var selectedFile = document.getElementById("inputFile" + c).files;
    //Check File is not Empty
    if (selectedFile.length > 0) {
      // Select the very first file from list
      var fileToLoad = selectedFile[0];
      // FileReader function for read the file.
      var fileReader = new FileReader();
      var base64;
      // Onload of file read the file content
      fileReader.onload = function (fileLoadedEvent) {
        base64 = fileLoadedEvent.target.result;
        if (type === "id") {
          setidPDF(base64);
        } else if (type === "degree") {
          setDegreePDF(base64);
        } else {
          setLicensePDF(base64);
        }
      };
      // Convert data to base64
      fileReader.readAsDataURL(fileToLoad);
    }
  }

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

export default DoctorSignUp;
