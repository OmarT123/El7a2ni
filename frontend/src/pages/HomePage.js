
import React, { useState, useEffect } from 'react'; 
import Footer from "../components/Footer";
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
