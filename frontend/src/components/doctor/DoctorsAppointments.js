import React, { useState, useEffect } from "react";
import axios from "axios";

const DoctorAppointments = ({ doctorId }) => {
  const [appointments, setAppointments] = useState({
    upcomingAppointments: [],
    pastAppointments: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/viewDoctorAppointments');
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching doctor appointments:", error);
      }
    };

    fetchData();
  }, [doctorId]);

  return (
    <div>
      <h2>Doctor Appointments</h2>
      <div>
        <h3>Upcoming Appointments</h3>
        <ul>
          {appointments.upcomingAppointments.map((appointment) => (
            <li key={appointment._id}>
              Patient: {appointment.patient.name}, Date: {new Date(appointment.date).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Past Appointments</h3>
        <ul>
          {appointments.pastAppointments.map((appointment) => (
            <li key={appointment._id}>
              Patient: {appointment.patient.name}, Date: {new Date(appointment.date).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorAppointments;
