import { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteDoctor = () => {
  const [message, setMessage] = useState(null);
  const [doctorList, setDoctorList] = useState([]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("/getAllDoctors");
      setDoctorList(response.data);
      console.log(response.data)
    } catch (error) {
      setMessage(error.message);
    }
  };
  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleRemovePatient = async (doctorId) => {
    try {
      const responseBackEnd = await axios.delete("/deleteDoctor?id="+doctorId);
      fetchDoctors()
 
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <div className="delete-doctor-container">
               <h3>Doctor List</h3>
           {doctorList && doctorList.map((doctor) => (
                <div key={doctor._id} className="doctor-card">
                     <p>Name: {doctor.name}</p>
                     <p>Email: {doctor.email}</p>
                     <p>Gender: {doctor.gender}</p>
                     <p>Birth Date: {doctor.birthDate}</p>
                     <p>Hourly Rate: {doctor.hourlyRate}</p>
                     <p>Affiliation: {doctor.affiliation}</p>
                     <p>Educational Background: {doctor.educationalBackground}</p>
                     <p>Pending Approval: {doctor.pendingApproval ?  "Pending" : "Accepted"}</p>
                     <p>Speciality: {doctor.speciality }</p>
                     <button onClick={() => handleRemovePatient(doctor._id)}>Remove</button>
                </div>
        ))}
             {message && <h3>{message}</h3>}
     </div>

    </div>
 );
};

export default DeleteDoctor;
