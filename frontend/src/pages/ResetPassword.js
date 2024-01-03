import React, { useState, useEffect, useNavigate } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import InputLabel from "@mui/material/InputLabel";
import Popup from "../components/Popup";
import { Fab, Input, Typography } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Copyright from "../components/Copyright";

const defaultTheme = createTheme();

const ResetPassword = () => {
  const [username, setUsername] = useState("");
  const [stage, setStage] = useState("first");
  const [OTP, setOTP] = useState(null);
  const [alert, setAlert] = useState(null);

  const sendOTP = async (event) => {
    event.preventDefault();
    const userData = {};
    const data = new FormData(event.currentTarget);
    setUsername(data.get("username"));
    if (data.get("username") !== "")
      userData["username"] = data.get("username");

    try {
      const response = await axios.put("/resetPassword", userData);

      setAlert(response.data);
      if (response.data.success) {
        localStorage.setItem("resetPasswordDone", userData);
        // console.log(response.data)
        setTimeout(() => {
          setStage("second");
          setAlert(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Username error:", error);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    const userData = {};

    const data = new FormData(e.currentTarget);
    if (username !== "") userData["username"] = username;
    if (data.get("otp") !== "") userData["otp"] = data.get("otp");
    if (data.get("password") !== "")
      userData["newPassword"] = data.get("password");

    try {
      const response = await axios.put("/resetPasswordWithOTP", userData);
      // console.log(response)
      setAlert(response.data);
      if (response.data.success) {
        setTimeout(() => {
          setAlert(null);
          window.location.href = "/login";
        }, 3000);
      }
    } catch (error) {
      console.error("OTP error:", error);
    }
  };

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container
          component="main"
          maxWidth="xs"
          sx={{ marginY: "12%", textAlign: "center" }}
        >
          <CssBaseline />
          {stage === "first" ? (
            <Box component="form" noValidate onSubmit={sendOTP} sx={{ mt: 3 }}>
              <Typography variant="h5">Reset Password</Typography>
              <br></br>
              <Grid container spacing={2}>
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
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Send OTP
              </Button>
            </Box>
          ) : (
            <Box
              component="form"
              noValidate
              onSubmit={resetPassword}
              sx={{ mt: 3 }}
            >
              <Fab
                onClick={() => setStage("first")}
                color="primary"
                size="small"
                sx={{
                  position: "absolute",
                  top: "18%",
                  left: "33%",
                  transform: "translateY(-50%)",
                }}
              >
                <KeyboardArrowLeftIcon />
              </Fab>
              <Typography variant="h5">Reset Password</Typography>
              <br></br>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="otp"
                    label="OTP"
                    name="otp"
                    autoComplete="otp"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type="password"
                    id="password"
                    label="Password"
                    name="password"
                    autoComplete="password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Reset Password
              </Button>
            </Box>
          )}
          {alert && (
            <Popup
              title={alert.title}
              message={alert.message}
              showButtons={false}
              onClose={() => setAlert(null)}
            />
          )}
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </>
  );
};

export default ResetPassword;
