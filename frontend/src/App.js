import { animateScroll as scroll } from "react-scroll";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  Button,
  Fab,
  useScrollTrigger,
  Fade,
  Zoom,
  Box,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
  Grid,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";

const ScrollTop = (props) => {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 1000,
      smooth: "easeInOutQuart",
    });
  };

  return (
    <Zoom in={trigger}>
      <div
        onClick={scrollToTop}
        role="presentation"
        style={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </div>
    </Zoom>
  );
};

const scrollToSection = (id) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

const App = () => {
  return (
    <>
      <CssBaseline />
      <NavBar />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>

      <ScrollTop>
        <Fab color="primary" size="large" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
      <Footer id="footer"/>
    </>
  );
};

export default App;
