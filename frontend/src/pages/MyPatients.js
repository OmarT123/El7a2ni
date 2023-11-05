import axios from 'axios';
import {useState,useEffect} from 'react'

import PatientDetail from '../components/PatientDetail'



const MyPatients = () => { 
    const [Patients,setPatients] = useState(null);
    const id = "653e568a25a9d07a9ad10789"
    const getPatients =  async () => {
         await axios.get('/viewmypatients?id='+id).then(
        (res) => { 
            const Patients = res.data
            setPatients(Patients)

        }
         );
    }
    useEffect(() => 
    {
          getPatients();
  },[])
    return (
        <div class="patients-container">
            <div className="Patient">
                {Patients && Patients.map((patient)=>(
                    <PatientDetail key={patient._id} patient={patient}/>
                ))}
            </div>
        </div>
    )
        }
export default MyPatients