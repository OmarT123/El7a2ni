import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FilterAppointments = ({ apiLink }) => {
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [appointments, setAppointments] = useState({
    upcomingAppointments: [],
    pastAppointments: [],
  });
  let isPatient;
  if(apiLink === "/filterAppointmentsForPatient")
  {
    isPatient = true;
  }
  else {
    isPatient = false;
  }
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    const filterData = {};
    if (status !== '') filterData['status'] = status;
    if (date !== '') filterData['date'] = date;

    try {
      const response = await axios.get(apiLink, { params: filterData });
      const apps = response.data;
      if (typeof apps === 'string') {
        setAppointments({ upcomingAppointments: [], pastAppointments: [] });
      } else {
        setAppointments(apps);
      }
    } catch (error) {
      // Handle error
    }
  };

  const cancelAppointment = async (e, appointmentID) => {
    e.preventDefault();
    const response = await axios.put('/cancelAppointment', { appointmentID: appointmentID });
    const res = response.data;
    if (typeof res === 'string') {
      window.location.reload();
      alert(res);
    } else {
      alert('Error cancelling appointment.');
    }
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  return (
    <form className='FilterAppointments'>
      <h3>Filter Appointments </h3>

      <label>Status: </label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value=''>Select Status</option>
        <option value='cancelled'>Cancelled</option>
        <option value='free'>Free</option>
        <option value='upcoming'>Upcoming</option>
        <option value='completed'>Completed</option>
      </select>
      <br />

      <label>Date: </label>
      <input
        type='date'
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
       <br />
       <button onClick={handleSubmit} style={{ marginTop: '10px' }}>Filter Appointments</button>


      <div>
        <h3>Upcoming Appointments</h3>
        <ul>
          {appointments.upcomingAppointments.map((appointment) => (
            <li key={appointment._id}>
              <div> Patient: {appointment.attendantName} </div>
              <div> Date: {new Date(appointment.date).toLocaleString()} </div>
              <div>Status: {appointment.status}</div>
              {appointment.status !== 'cancelled' && (
                <button onClick={(e) => cancelAppointment(e, appointment._id)}>Cancel Appointment</button>
              )}
              <hr />
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Past Appointments</h3>
        <ul>
          {appointments.pastAppointments.map((appointment) => (
            <li key={appointment._id}>
              <div> Patient name: {appointment.attendantName} </div>
              <div> Date: {new Date(appointment.date).toLocaleString()} </div>
              <div> Status: {appointment.status}</div>
              {isPatient && (
                 <Link to={`/RequestFollowup`}><button>Request Follow-up</button></Link>
              )}
              <hr />
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
};

export default FilterAppointments;