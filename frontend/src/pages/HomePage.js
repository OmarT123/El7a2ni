
import { Container, Typography, Icon, Box } from '@mui/material';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicationIcon from '@mui/icons-material/Medication';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import EventNoteIcon from '@mui/icons-material/EventNote';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HearingIcon from '@mui/icons-material/Hearing';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

import ImageSlider from '../components/ImageSlider';
import FeatureCard from '../components/FeatureCard';
import DotLine from '../components/DotLine';
import FunFact from '../components/FunFacts';
import TopLeftIconHeaderText from '../components/TopLeftIconHeaderText';
import React, { useState } from 'react';
import Popup from '../components/Popup';
import ServiceCard from '../components/ServiceCard';
import HealingIcon from '@mui/icons-material/Healing'; 
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import GuestHomePage from "../components/HomePage/GuestHomePage";

const HomePage = ({ scrollToSection }) => {
  const [userType, setUserType] = useState("guest");
  
  useEffect(() => {
    axios.get("/loginAuthentication").then((response) => {
      const { success, type, user } = response.data;
      setUserType(type);
    });
  }, []);

  return (
    <>
      {userType === "guest" ? (
        <GuestHomePage scrollToSection={scrollToSection} />
      ) : userType === "patient" ? (
        "patient page"
      ) : userType === "doctor" ? (
        "doctor page"
      ) : userType === "pharmacist" ? (
        "pharmacist page"
      ) : (
        "admin page"
      )}

      <Footer />
    </>
  );
};

export default HomePage;
