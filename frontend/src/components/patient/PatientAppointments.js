import React, { useState, useEffect } from "react";
import axios from "axios";
import PatientAuthorization from "../PatientAuthorization";

const PatientAppointments = ({ user }) => {
  // Hardcoded patientId for demonstration purposes
  // const hardcodedPatientId = "656cb41125a74d947f10e349";

  const [appointments, setAppointments] = useState({
    upcomingAppointments: [],
    pastAppointments: [],
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('/viewPatientAppointments', {
          params: {
            id: user._id,
          },
        });

        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching patient appointments:", error);
      }
    };

    fetchAppointments();
  }, []); // Removed patientId from the dependency array since it's hardcoded

  return (
    <div>
      <h2>Patient Appointments</h2>
      <div>
        <h3>Upcoming Appointments</h3>
        <ul>
          {appointments.upcomingAppointments.map((appointment) => (
            <li key={appointment._id}>
              Doctor: {appointment.doctor.name}, Date: {new Date(appointment.date).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Past Appointments</h3>
        <ul>
          {appointments.pastAppointments.map((appointment) => (
            <li key={appointment._id}>
              Doctor: {appointment.doctor.name}, Date: {new Date(appointment.date).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PatientAuthorization(PatientAppointments);
