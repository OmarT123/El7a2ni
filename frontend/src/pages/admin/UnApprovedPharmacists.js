import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PharmacistDetails from '../../components/pharmacistDetails';
import AdminAuthorization from '../../components/AdminAuthorization';


const UnApprovedPharmacists = ({ user }) => {
  const [pharmacists, setPharmacists] = useState(null)

  useEffect(() => 
  {
    const fetchPharmacists = async() => {
    await axios.get('/getUnapprovedPharmacists').then(
            (res) => { 
                const pharmacists = res.data
                setPharmacists(pharmacists)
                
            }
             );
          }
          fetchPharmacists();

  },[])
  return (
    <div className="home">
        <div className="Pharmacists">
          {pharmacists &&
            pharmacists.map((pharmacist) => (
              <PharmacistDetails key={pharmacist._id} pharmacist={pharmacist} />
            ))}
        </div>
    </div>
  );
};

export default AdminAuthorization(UnApprovedPharmacists);
