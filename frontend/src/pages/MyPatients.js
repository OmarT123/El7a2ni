import axios from 'axios';
import {useState,useEffect} from 'react'

import PatientDetail from '../components/PatientDetail'



const MyPatients = () => { 
    const [Patients,setPatients] = useState([]);
    const[name,setName]=useState('');
   //hardcoded id for a doctor
    const id = "653e568a25a9d07a9ad10789"
    
    
    const search = async(e) => {
        e.preventDefault()
        const body = {}
        if (name !== "")
            body['name']=name
        await axios.get("/viewmypatientsbyname?id="+id,{params : body})
        .then((res)=>{
            console.log(res.data)
            //console.log(docs)
            setPatients(res.data)
        }).catch((err)=>console.log(err))
    }

    const getPatients =  async () => {
         await axios.get('/viewmypatients?id='+id).then(
        (res) => { 
            setPatients(res.data)

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
export default MyPatients