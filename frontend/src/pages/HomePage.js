import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import axios from "axios";
import GuestHomePage from "../components/HomePage/GuestHomePage";
import AdminHomePage from "../components/HomePage/AdminHomePage";
import { createContext } from "react";
import PharmacistHomePage from "../components/HomePage/PharmacistHomePage";
import PdfViewer from "../components/PdfViewer";

export const HomePageContext = createContext();

const HomePage = ({ scrollToSection }) => {
  const [userType, setUserType] = useState("guest");
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("/loginAuthentication").then((response) => {
      const { success, type, user } = response.data;
      if (success) {
        setUserType(type);
        setUser(user);
      }
    });
  }, []);

  return (
    <>
      <HomePageContext.Provider value={{ user, userType }}>
        {userType === "guest" ? (
          <GuestHomePage scrollToSection={scrollToSection} />
        ) : userType === "patient" ? (
          "patient page"
        ) : userType === "doctor" ? (
          "doctor page"
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
