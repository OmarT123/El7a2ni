import React, { useState } from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios';

const PatientDetail = ({ patient }) => {
    const [rescheduleDate, setRescheduleDate] = useState('');
  
    const handleReschedule = async () => {
      try {
        const res = await axios.post('/rescheduleAppointment', {
          patientId: patient._id,
          rescheduleDate: rescheduleDate,
        });
  
        // Handle success (you can show a success message or perform other actions)
        console.log(res.data.message);
      } catch (error) {
        // Handle error (you can show an error message or perform other actions)
        console.error(error.message);
      }
    };
  

    return (
        <div className="details">
          <h4>{patient.name}</h4>
          <p><strong>Birth Date: </strong>{patient.birthDate}</p>
          <p><strong>Gender: </strong>{patient.gender}</p>
          <p><strong>Mobile Number: </strong>{patient.mobileNumber}</p>
          <p><strong>Emergency Contact: </strong>{patient.emergencyContact.name}, {patient.emergencyContact.mobileNumber}, {patient.emergencyContact.relation}</p>
    
          {/* Existing family members and health package details... */}
          
          {/* New section for rescheduling */}
          <div className="reschedule-section">
            <label>
              Reschedule Date:
              <input
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
              />
            </label>
            <button onClick={handleReschedule}>Reschedule Appointment</button>
          </div>
        </div>
      );
    };
export default PatientDetail