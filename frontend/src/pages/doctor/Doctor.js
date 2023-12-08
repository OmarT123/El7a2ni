import axios from 'axios';
import { useState, useEffect } from 'react';

const Doctor = () => {
  const [doctor, setDoctor] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [availableAppointments, setAvailableAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [reservationName, setReservationName] = useState('');




  useEffect(() => {
    const getDoctor = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const id = queryParams.get('id');
      try {
        const res = await axios.get('/selectDoctorFromFilterSearch?id=' + id);
        setDoctor(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };

    getDoctor();
  }, []);


  const fetchAvailableAppointments = async () => {
    try {
      const res = await axios.get('/filterAppointmentsForDoctor', {
        params: {
          status: 'free', 
          id: doctor._id, 
        },
      });
      setAvailableAppointments(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleConfirmReservation = async () => {
    try {
      if (!selectedAppointment) {
        // No appointment selected, handle accordingly
        console.log('No appointment selected');
        return;
      }
  
      // Extract patient ID from the selected appointment
      const patientId = reservationName;
  
      // Confirm reservation using patient ID
      await axios.post('/confirmReservation', {
        appointmentId: selectedAppointment.id,
        patientId: patientId,
        status: 'upcoming',
      });
  
      fetchAvailableAppointments();
      setSelectedAppointment(null);
      setReservationName('');
    } catch (err) {
      console.log(err.message);
    }
  };

  

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      fetchAvailableAppointments();
    }
  };
  

  return (
    <div>
      {doctor && (
        <div className='user-info'>
          <p><strong>Name: </strong>{doctor.name}</p>
          <p><strong>Email: </strong>{doctor.email}</p>
          <p><strong>Birth Date: </strong>{doctor.birthDate}</p>
          <p><strong>Hourly Rate: </strong>{doctor.hourlyRate}</p>
          <p><strong>Affiliation: </strong>{doctor.affiliation}</p>
          <p><strong>Educational Background: </strong>{doctor.educationalBackground}</p>
          <p><strong>Speciality: </strong>{doctor.speciality}</p>

          {/* Button to toggle appointments section */}
          <button onClick={toggleExpand}>
            {isExpanded ? 'Hide Appointments' : 'Show Appointments'}
          </button>

          {/* Appointments section */}
          {isExpanded && (
            <div>
              {/* Display appointments here */}
              {availableAppointments.length > 0 ? (
                availableAppointments.map(appointment => (
                  <p key={appointment.id} onClick={() => handleAppointmentClick(appointment)}>
                    Appointment Date: {appointment.date}
                  </p>
                ))
              ) : (
                <p>No available appointments</p>
              )}
            </div>
          )}

          {/* Pop-up/modal for reservation */}
          {selectedAppointment && (
            <div className="reservation-popup">
              <label>
                ID for Reservation:
                <input
                  type="text"
                  value={reservationName}
                  onChange={(e) => setReservationName(e.target.value)}
                />
              </label>
              <button onClick={handleConfirmReservation}>Confirm Reservation</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Doctor;

