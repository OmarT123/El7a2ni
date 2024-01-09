import {
  AppBar,
  Button,
  Container,
  Grid,
  Link,
  Toolbar,
  Typography,
  useScrollTrigger,
  Slide,
  Box
} from "@mui/material";
import { Phone, Mail } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import React from "react";

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

const UpperBarStyle = {
  "border-bottom": "1px solid #999",
  "background-color": "#EEEEEE",
};

const LowerBarStyle = {
  "background-color": "#EEEEEE",
  border: "none",
  height: "100px",
};

const LinkStyle = {
  "text-decoration": "none",
  color: "#000",
  "&:hover": {
    color: "#4E4FEB",
    cursor: "pointer",
  },
};

const GridStyle = {
  padding: "0 150px",
};

const LogoStyle = {
  color: "#000",
  "text-decoration": "none",
  "margin-top": "5px",
  "&hover": {
    color: "#aaa",
    cursor: "pointer",
  },
};

const ImageStyle = {
  width: "75px",
  height: "80px",
};

const ContainerStyle = {
  display: "flex",
  "align-items": "center",
  "flex-direction": "row",
};

const ButtonStyle = {
  transition: "background-color 0.4s ease-in-out, color 0.4s ease-in-out",
  "&:hover": {
    "background-color": "#111",
    color: "#fff",
  },
};

const BorderLinkStyle = {
  "text-decoration": "none",
  color: "#000",
  position: "relative",
  overflow: "hidden",
  "border-bottom": "3px solid transparent",
  "&:before": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 0,
    "border-bottom": "2px solid #4E4FEB",
    transition: "width 0.3s ease-in-out",
  },
  "&:hover:before": {
    width: "100%",
  },
  "&:hover": {
    color: "#4E4FEB",
    cursor: "pointer",
  },
};

const NavBar = () => {
  const navigate = useNavigate();

  const handleClick = (link) => {
    navigate(link);
  };

  return (
    <>
      <AppBar sx={{ "background-color": "#EEEEEE" }} position="sticky">
        <HideOnScroll>
          <Toolbar sx={UpperBarStyle}>
            <Grid container spacing={2} sx={GridStyle}>
              <Grid item>
                <Link sx={LinkStyle}>About</Link>
              </Grid>
              <Grid item>
                <Link sx={LinkStyle}>Doctors</Link>
              </Grid>
              <Grid item>
                <Link sx={LinkStyle}>Contact</Link>
              </Grid>
              <Grid item>
                <Link sx={LinkStyle}>FAQ</Link>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={GridStyle}>
              <Grid item>
                <Link sx={LinkStyle}>
                  <Phone fontSize="sm" />
                  +49 176 681 44516
                </Link>
              </Grid>
              <Grid item>
                <Link sx={LinkStyle} href="mailto:el7a2ni@outlook.com">
                  <Mail fontSize="sm" />
                  el7a2ni@outlook.com
                </Link>
              </Grid>
            </Grid>
          </Toolbar>
        </HideOnScroll>
        <ElevationScroll>
          <Toolbar sx={LowerBarStyle}>
            <Container sx={ContainerStyle}>
              <Grid container>
                <Link sx={LogoStyle}>
                  <img style={ImageStyle} src="itrylogo-removebg-preview.png" alt="logo.png" />
                </Link>
              </Grid>
              <Grid container spacing={3} width={2500} color="#111">
                <Grid item>
                  <Link sx={LinkStyle}>
                    <Typography sx={BorderLinkStyle} variant="h6">
                      Home
                    </Typography>
                  </Link>
                </Grid>
                <Grid item>
                  <Link sx={LinkStyle}>
                    <Typography sx={BorderLinkStyle} variant="h6">
                      Doctors
                    </Typography>
                  </Link>
                </Grid>
                <Grid item>
                  <Link sx={LinkStyle}>
                    <Typography sx={BorderLinkStyle} variant="h6">
                      Services
                    </Typography>
                  </Link>
                </Grid>
                <Grid item>
                  <Link sx={LinkStyle}>
                    <Typography sx={BorderLinkStyle} variant="h6">
                      Pages
                    </Typography>
                  </Link>
                </Grid>
                <Grid item>
                  <Link sx={LinkStyle}>
                    <Typography sx={BorderLinkStyle} variant="h6">
                      Blogs
                    </Typography>
                  </Link>
                </Grid>
                <Grid item>
                  <Link sx={LinkStyle}>
                    <Typography sx={BorderLinkStyle} variant="h6">
                      Contact Us
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    sx={ButtonStyle}
                    variant="outlined"
                    onClick={() => handleClick("login")}
                  >
                    Log in
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    sx={ButtonStyle}
                    variant="contained"
                    onClick={() => handleClick("signup")}
                  >
                    Sign Up
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Toolbar>
        </ElevationScroll>
      </AppBar>
    </>
  );
};

export default NavBar;
