import { useState, useEffect } from 'react';
import axios from 'axios';

const DeletePatient = () => {
  const [message, setMessage] = useState(null);
  const [patientsList, setPatientsList] = useState([]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("/getAllPatients");
      setPatientsList(response.data);
      console.log(response.data)
    } catch (error) {
      setMessage(error.message);
    }
  };
  useEffect(() => {
    fetchPatients();
  }, []);

  const handleRemovePatient = async (patientId) => {
    try {
      const responseBackEnd = await axios.delete("/deletePatient?id="+patientId);
      fetchPatients()
 
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <div className="delete-patient-container">
               <h3>Patients List</h3>
           {patientsList && patientsList.map((patient) => (
                <div key={patient._id} className="patient-card">
                     <p>Name: {patient.name}</p>
                     <p>Email: {patient.email}</p>
                     <p>Gender: {patient.gender}</p>
                     <p>Birth Date: {patient.birthDate}</p>
                     <p>Mobile Number: {patient.mobileNumber}</p>
                     <p>Emergency Contact: {patient.emergencyContact.name }, {patient.emergencyContact.mobileNumber}, {patient.emergencyContact.relation}</p>
                    {patient.familyMembers &&patient.familyMembers.map((familyMember)=> (
                      <div key={familyMember._id} className="familyMember-card">
                    
                    <p>Family Member Name : {familyMember.name}</p> 
                    <p>Family Member Relation : {familyMember.relationToPatient}</p>  
                    </div>
                   ) )  }
                   {/* {patient.healthPackage &&patient.healthPackage.map((healthPack)=> (
                      <div key={healthPack._id} className="healthPack-card">
                    <p>Health Package Name : {healthPack.name}</p> 
                    </div>
                   ) )  } */}
                   {/* /* need to display the health package with populate ASAP */ }


      <button onClick={() => handleRemovePatient(patient._id)}>Remove</button>
    </div>
  ))}
  {message && <h3>{message}</h3>}
</div>

    </div>
  );
};

export default DeletePatient;
