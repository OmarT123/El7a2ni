import {useEffect, useState} from 'react';
import axios from 'axios';
import AdminAuthorization from '../../components/AdminAuthorization';

//components
import DoctorDetails from '../../components/patient/DoctorDetails'

const UnapprovedDoctors = ({user}) => {
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
          <DoctorDetails key={doctor._id} doctor = {doctor} link={"DoctorApplication"} />
        ))}
      </div>
    </div>
  )
}

export default AdminAuthorization(UnapprovedDoctors) ;
