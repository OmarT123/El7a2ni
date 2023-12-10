import axios from 'axios'
import {useEffect, useState} from 'react'

import PatientDetail from '../../components/patient/PatientDetail'
import DoctorAuthorization from '../../components/DoctorAuthorization'

const FilterPatientsByAppointments = ({user}) => {
    const [patients, setPatients] = useState([])

    const filter = async() => {
        const id = user._id;
        await axios.get("/filterPatientsByAppointments?id="+id).then(res=>setPatients(res.data)).catch(err => console.log(err.message))
    }

    useEffect(() => 
    {
          filter();
  },[])

    return (
        <div>
            {patients.length>0 && patients.map(patient => (<PatientDetail key={patient._id} patient={patient}/>))}
        </div>
    )
}

export default DoctorAuthorization(FilterPatientsByAppointments) 