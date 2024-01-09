import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import axios from 'axios'

const paperStyle = {
    width: "1200px",
    margin: "auto",
    padding: 16,
    marginTop: "30px",
  };
  
  const listStyle = {
    marginTop: 16,
  };
  
  const buttonStyle = {
    backgroundColor: "#1976D2",
    color: "#fff",
    borderRadius: "50%",
    width: "56px",
    height: "56px",
    cursor: "pointer",
    marginTop: "20px",
    "&:hover": {
      backgroundColor: "#1565C0",
    },
  };
  
  const iconStyle = {
    fontSize: "2rem",
  };
  

const AppointmentsView = () => {
    const [appointments, setAppointments] = useState([])
    
    const fetchAppointments = async () => {
        try {
          const response = await axios.get('/viewDoctorAppointments');
          setAppointments(response.data);
        } catch (error) {
          console.error("Error fetching doctor appointments:", error);
        }
      };
    return(
        <>
        
        <Paper style={paperStyle} elevation={3}>

        </Paper>
        </>
    )
}

export default AppointmentsView