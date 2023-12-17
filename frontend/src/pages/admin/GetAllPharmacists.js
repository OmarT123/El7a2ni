import {useEffect, useState} from 'react';
import axios from 'axios';

//components
import AdminAuthorization from '../../components/AdminAuthorization';
import PharmacistDetailsList from '../../components/pharmacistDetailsList';


const GetAllPharmacists = ({user}) => {
  const [pharmacists, setPharmacists] = useState(null)

  useEffect(() => 
  {
    const fetchPharmacists = async() => {
    await axios.get('/viewAllPharmacists').then(
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
        {pharmacists && pharmacists.map((pharmacist) => (
          <PharmacistDetailsList key={pharmacist._id} pharmacist = {pharmacist} />
        ))}
      </div>
    </div>
  )
}

export default AdminAuthorization(GetAllPharmacists);
