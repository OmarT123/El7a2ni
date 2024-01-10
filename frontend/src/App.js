import { useState } from "react";
import { animateScroll as scroll } from "react-scroll";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Fab, useScrollTrigger, Zoom, CssBaseline } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import ContractView from "./pages/ContractView";
import SuccessfulCheckout from "./pages/SuccessfulCheckout";
import CancelCheckout from "./pages/CancelCheckout";
import SuccessfulCheckoutPackage from "./pages/SuccessfulCheckoutPackage";
import SuccessfulCheckoutApp from "./pages/SuccessfulCheckoutApp";

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
        style={{ position: "fixed", bottom: 16, left: 16 }}
      >
        {children}
      </div>
    </Zoom>
  );
};
const App = () => {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/doctorContract" element={<ContractView />} />
          <Route path="/SuccessfulCheckout" element={<SuccessfulCheckout />} />
          <Route path="/CancelCheckout" element={<CancelCheckout />} />
          <Route path="/SuccessfulCheckoutPackage" element={<SuccessfulCheckoutPackage />} />
          <Route path="/SuccessfulCheckoutApp" element={<SuccessfulCheckoutApp />} />
        </Routes>
        {window.location.pathname !== "/doctorContract" && (
          <ScrollTop>
            <Fab color="primary" size="large" aria-label="scroll back to top">
              <KeyboardArrowUpIcon />
            </Fab>
          </ScrollTop>
        )}
      </BrowserRouter>
    </>
  );
};

export default App;
