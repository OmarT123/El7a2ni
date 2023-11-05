import {useEffect, useState} from 'react';
import axios from 'axios';

//components
import DoctorDetails from '../components/DoctorDetails'

const UnapprovedDoctors = () => {
  const [doctors, setDoctors] = useState(null)

  useEffect(() => 
  {
    const fetchDoctors = async() => {
    await axios.get('/viewDocInfo').then(
            (res) => { 
                const doctors = res.data
                setDoctors(doctors)
            }
             );
          }
          fetchDoctors();

  },[])

  return (
    <div className="home">
      <div className="Doctors">
        {doctors && doctors.map((doctor) => (
          <DoctorDetails key={doctor._id} doctor = {doctor} />
        ))}
      </div>
    </div>
  )
}

export default UnapprovedDoctors
