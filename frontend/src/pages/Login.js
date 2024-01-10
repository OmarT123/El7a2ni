import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Copyright from "../components/Copyright";
import Popup from '../components/Popup'

const defaultTheme = createTheme();

const Login = () => {
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(async () => {
    //  localStorage.clear()
    // await axios.get('/logout')
    const userToken = localStorage.getItem("userToken");

    if (userToken) {
      window.location.href = "/";
    } else {
      setShowContent(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {};
    const data = new FormData(e.currentTarget);
    if (data.get("username") !== "")
      userData["username"] = data.get("username");
    if (data.get("password") !== "")
      userData["password"] = data.get("password");

    try {
      const response = await axios.post("/login", userData);

      if (response.data.success) {
        localStorage.setItem("userToken", response.data.token);
        axios.get("/loginAuthentication").then((response) => {
          const { success, type, user } = response.data;
          if (type === "doctor" && user.status === "approved")
            window.location.href = "/doctorContract";
          else window.location.href = "/";
        });
      } else {
        setAlert({
          title: "Invalid Credentials",
          message: "Wrong username or password",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <>
      {showContent && (
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  backgroundColor: "#fff",
                  margin: "20px auto",
                  border: "1px solid #bbb",
                  transition: "background-color 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                <img src="itrylogo-removebg-preview.png" width="45px" height="50px" />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="/resetPassword" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/signup" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
          </Container>
          {alert && (
            <Popup
              onClose={() => setAlert(null)}
              title={alert.title}
              message={alert.message}
              showButtons={false}
            />
          )}
        </ThemeProvider>
      )}
    </>
  );
};

export default Login;
