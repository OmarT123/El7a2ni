import * as React from "react";
import { useState, useEffect } from "react";
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
import { List, ListItem } from "@mui/material";
import Face2Icon from "@mui/icons-material/Face2";
import Face3Icon from "@mui/icons-material/Face3";
import Face1Icon from "@mui/icons-material/Face4";
import PatientSignUp from "../components/SignUp/PatientSignUp";
import DoctorSignUp from "../components/SignUp/DoctorSignUp";
import PharmacistSignUp from "../components/SignUp/PharmacistSignUp";
import Copyright from "../components/Copyright";

const defaultTheme = createTheme();

const SignUp = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // to make sure only a guest can view this page
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      window.location.href = "/";
    } else {
      setShowContent(true);
    }
  }, []);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <>
      {showContent && (
        <ThemeProvider theme={defaultTheme}>
          <Container
            component="main"
            maxWidth="xs"
            sx={{ textAlign: "center", marginY: "60px" }}
          >
            <CssBaseline />
            <Avatar
              sx={{
                width: 60,
                height: 60,
                backgroundColor: "#fff",
                margin: "0 auto",
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
              <img src="logo.png" width="100px" height="100px" />
            </Avatar>
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "60%",
                }}
              >
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    backgroundColor: "#fff",
                    margin: "0 auto",
                    border: "1px solid #bbb",
                    transition: "background-color 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "primary.main",
                      cursor: "pointer",
                    },
                  }}
                  onMouseEnter={handleHover}
                  onMouseLeave={handleMouseLeave}
                >
                  <Face1Icon
                    onClick={() => handleItemClick("patient")}
                    color="primary"
                    sx={{
                      height: "50px",
                      width: "50px",
                      padding: "5px",
                      fill: isHovered ? "#EEEEEE" : "",
                    }}
                  />
                </Avatar>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    backgroundColor: "#fff",
                    margin: "0 auto",
                    border: "1px solid #bbb",
                    transition: "background-color 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "primary.main",
                      cursor: "pointer",
                    },
                  }}
                  onMouseEnter={handleHover}
                  onMouseLeave={handleMouseLeave}
                >
                  <Face2Icon
                    onClick={() => handleItemClick("doctor")}
                    color="primary"
                    sx={{
                      height: "50px",
                      width: "50px",
                      padding: "5px",
                      fill: isHovered ? "#EEEEEE" : "",
                    }}
                  />
                </Avatar>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    backgroundColor: "#fff",
                    margin: "0 auto",
                    border: "1px solid #bbb",
                    transition: "background-color 0.3s ease-in-out",
                    "&:hover": {
                      backgroundColor: "primary.main",
                      cursor: "pointer",
                    },
                  }}
                  onMouseEnter={handleHover}
                  onMouseLeave={handleMouseLeave}
                >
                  <Face3Icon
                    onClick={() => handleItemClick("pharmacist")}
                    color="primary"
                    sx={{
                      height: "50px",
                      width: "50px",
                      padding: "5px",
                      fill: isHovered ? "#EEEEEE" : "",
                    }}
                  />
                </Avatar>
              </Box>
              <br></br>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              {selectedItem === "patient" ? (
                <PatientSignUp />
              ) : selectedItem === "doctor" ? (
                <DoctorSignUp />
              ) : selectedItem === "pharmacist" ? (
                <PharmacistSignUp />
              ) : (
                <Box>
                  <br></br>
                  <br></br>
                  <Typography variant="h4">
                    Please Choose A Sign Up Category
                  </Typography>
                  <br></br>
                  <br></br>
                </Box>
              )}
            </Box>
            <Copyright sx={{ mt: 5 }} />
          </Container>
        </ThemeProvider>
      )}
    </>
  );
};

export default SignUp;
