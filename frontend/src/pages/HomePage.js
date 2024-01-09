import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import axios from "axios";
import GuestHomePage from "../components/HomePage/GuestHomePage";
import AdminHomePage from "../components/HomePage/AdminHomePage";
import { createContext } from "react";
import PharmacistHomePage from "../components/HomePage/PharmacistHomePage";
import DoctorHomePage from "../components/HomePage/DoctorHomePage";
import PatientHomePage from "../components/HomePage/PatientHomePage";

export const HomePageContext = createContext();

const HomePage = ({ scrollToSection }) => {
  const [userType, setUserType] = useState("guest");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const login = async() =>{
      await axios.get("/loginAuthentication").then((response) => {
        const { success, type, user } = response.data;
        if (success) {
          setUserType(type);
          setUser(user);
        }
      });
    }
    login()
  }, []);

  return (
    <>
      <HomePageContext.Provider value={{ user, userType }}>
        {userType === "guest" ? (
          <GuestHomePage scrollToSection={scrollToSection} />
        ) : userType === "patient" ? (
          <PatientHomePage />
        ) : userType === "doctor" ? (
          <DoctorHomePage user={user} />
        ) : userType === "pharmacist" ? (
          <PharmacistHomePage />
        ) : (
          <AdminHomePage scrollToSection={scrollToSection} />
        )}

        <Footer />
      </HomePageContext.Provider>
    </>
  );
};

export default HomePage;
