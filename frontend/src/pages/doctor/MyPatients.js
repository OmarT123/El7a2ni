import axios from 'axios';
import {useState,useEffect} from 'react'

import PatientDetail from '../../components/patient/PatientDetail'
import DoctorAuthorization from '../../components/DoctorAuthorization';



const MyPatients = ({user}) => { 
    const [Patients,setPatients] = useState([]);
    const[name,setName]=useState('');
    const id = user._id;
    const search = async(e) => {
        e.preventDefault()
        const body = {}
        if (name !== "")
            body['name']=name
        await axios.get("/viewmypatientsbyname",{params : body})
        .then((res)=>{
            setPatients(res.data)
        }).catch((err)=>console.log(err))
    }

    const getPatients =  async () => {
         await axios.get('/viewmypatients').then(
        (res) => { 
            setPatients(res.data);
        }
         );
    }
    useEffect(() => 
    {
          getPatients();
  },[])

  return (
    <div>
         <div>
            <form className="create">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Search by Patient name" />
                <button onClick={search}>Submit</button>
            </form>
        </div>
        <div className="patients-container">
            <div className="Patient">
                {Patients && Patients.map((patient) => (
                    <PatientDetail key={patient._id} patient={patient} />
                ))}
            </div>
        </div>
       
    </div>
);

        }
export default DoctorAuthorization(MyPatients) ;