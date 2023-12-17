import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorAuthorization from '../../components/DoctorAuthorization';

const AddAppointmentSlots = ({user}) => {
  // Set your API links here
  const getAppointmentsApiLink = "/filterAppointmentsForDoctor" ;
  const addAppointmentApiLink = "/addAppointmentSlots";
  const queryParams = new URLSearchParams(window.location.search)
  const id = queryParams.get('id')

  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [message, setMessage] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);

  const FilterData = {};
  FilterData['status'] = '';
  FilterData['date'] = '';

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(getAppointmentsApiLink, FilterData);
      const apps = response.data;
      setAppointments(apps);

      // Extract existing times for the selected date
      const existingTimes = apps
        .filter(appointment => appointment.date.substr(0, 10) === selectedDate)
        .map(appointment => appointment.date.substr(11, 5));

      // Generate available times
      const allTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
      const availableTimes = allTimes.filter(time => !existingTimes.includes(time));

      setAvailableTimes(availableTimes);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    // Fetch appointments when the component mounts
    fetchAppointments();
  }, [selectedDate]);

  const handleAddAppointment = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      setMessage('Please select both date and time.');
      return;
    }
    let newAppointment={};
    if(id){
      newAppointment = {
      date: selectedDate,
      time: selectedTime,
      patientID: id,
    };}
    else {
      newAppointment = {
      date: selectedDate,
      time: selectedTime,
    };
    }
    try {
      const response = await axios.post(addAppointmentApiLink, newAppointment);
      const result = response.data;

      if (typeof result === 'string') {
        setMessage(result);
      } else {
        setMessage('Appointment added successfully!');
        // Refresh appointments after adding
        fetchAppointments();
        // Clear selected date and time
        setSelectedDate('');
        setSelectedTime('');
      }
    } catch (error) {
      console.error('Error adding appointment:', error);
      setMessage('An error occurred while adding the appointment.');
    }
  };

  return (
    <div className='DoctorAppointments'>
      <h3>Add Appointment Slot</h3>

      <h4>Already scheduled appointments:</h4>
      {appointments.length > 0 ? (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id}>
              <div>Date: {appointment.date.substr(0, 10)}</div>
              <div>Time: {appointment.date.substr(11, 5)}</div>
              {/* Add other appointment details as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No appointments found.</p>
      )}

      <h4>Add new slot:</h4>
      <form onSubmit={handleAddAppointment}>
        <label>Date: </label>
        <input
          type='date'
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <label> Time: </label>
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          {availableTimes.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>

        <button type='submit'  style={{ marginLeft: '10px' }}>Add Appointment</button>
      </form>

      {message && <h3>{message}</h3>}
    </div>
  );
};

export default  DoctorAuthorization(AddAppointmentSlots);
