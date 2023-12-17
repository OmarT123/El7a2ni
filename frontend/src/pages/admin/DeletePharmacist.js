import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminAuthorization from '../../components/AdminAuthorization';

const DeletePharmacist = ({ user }) => {
  const [message, setMessage] = useState(null);
  const [pharmacistList, setPharmacistList] = useState([]);

  const fetchPharmacist = async () => {
    try {
      const response = await axios.get("/getAllPharmacists");
      setPharmacistList(response.data);
      console.log(response.data)
    } catch (error) {
      setMessage(error.message);
    }
  };
  useEffect(() => {
    fetchPharmacist();
  }, []);

  const handleRemovePatient = async (pharmacistId) => {
    try {
      const responseBackEnd = await axios.delete("/deletePharmacist?id="+pharmacistId);
      fetchPharmacist();
 
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <div className="delete-pharmacist-container">
               <h3>Pharmacists List</h3>
           {pharmacistList && pharmacistList.map((pharmacist) => (
                <div key={pharmacist._id} className="pharmacist-card">
                     <p>Name: {pharmacist.name}</p>
                     <p>Email: {pharmacist.email}</p>
                     <p>Gender: {pharmacist.gender}</p>
                     <p>Birth Date: {pharmacist.birthDate}</p>
                     <p>Hourly Rate: {pharmacist.hourlyRate}</p>
                     <p>Affiliation: {pharmacist.affiliation}</p>
                     <p>Educational Background: {pharmacist.educationalBackground}</p>
                     <p>Pending Approval: {pharmacist.pendingApproval ?  "Pending" : "Accepted"}</p>


      <button onClick={() => handleRemovePatient(pharmacist._id)}>Remove</button>
    </div>
  ))}
  {message && <h3>{message}</h3>}
</div>

    </div>
  );
};

export default AdminAuthorization(DeletePharmacist) ;