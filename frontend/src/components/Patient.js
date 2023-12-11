import axios from 'axios'
import { useState,useEffect } from 'react'
// import DoctorAuthorization from '../../components/PatientAuthorization'

const Patient = ({user}) => {
    const [patient, setPatient] = useState(null)
    const [showRecords, setShowRecords] = useState(false);

    useEffect(() => {
            const getPatient = async()=> {
                const queryParams = new URLSearchParams(window.location.search)
                const id = queryParams.get('id');
            await axios.get('/viewpatient?id='+id).then(res => setPatient(res.data)).catch(err=>console.log(err.message))
            }
            getPatient()
        },[])
        const toggleRecords = async(e) => {
            e.preventDefault()
            setShowRecords(!showRecords);
            };
    return (
        <div>
        {patient && <div className='user-info'>
            <p><strong>name: </strong>{patient.name}</p>
            <p><strong>email: </strong>{patient.email}</p>
            <p><strong>birthDate: </strong>{patient.birthDate}</p>
            <button onClick={toggleRecords}>Health Records</button>
        
        </div>}
        {showRecords && (
                <div className='health-records'>
                    <h3>Health Records:</h3>
                    <br></br>
                    <ul>
                        {patient.HealthRecords.map((record, index) => (
                            <li key={index}> {record}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default Patient