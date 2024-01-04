
import React, { useState, useEffect } from 'react'; 
import Footer from "../components/Footer";
import axios from "axios";
import GuestHomePage from "../components/HomePage/GuestHomePage";
import AdminHomePage from "../components/HomePage/Admin/AdminHomePage";


const HomePage = ({ scrollToSection }) => {
  const [userType, setUserType] = useState("guest");
  
  useEffect(() => {
    axios.get("/loginAuthentication").then((response) => {
      const { success, type, user } = response.data;
      if (success)
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
        <AdminHomePage scrollToSection={scrollToSection} />
      )}

      <Footer />
    </>
  );
};

export default HomePage;
