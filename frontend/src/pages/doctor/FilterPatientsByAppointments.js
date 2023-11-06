import axios from 'axios'
import {useEffect, useState} from 'react'

import PatientDetail from '../../components/patient/PatientDetail'

const FilterPatientsByAppointments = () => {
    const [patients, setPatients] = useState([])

    const filter = async() => {
        const id = "65481b16137be867953a0c9e"
        await axios.get("/filterPatientsByAppointments?id="+id).then(res=>setPatients(res.data)).catch(err => console.log(err.message))
    }

    // useEffect(()=> filter(),[])
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

export default FilterPatientsByAppointments