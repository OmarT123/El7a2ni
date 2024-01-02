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
            <p><strong>Name: </strong>{patient.name}</p>
            <p><strong>Username: </strong>{patient.username}</p>
            <p><strong>Email: </strong>{patient.email}</p>
            <p><strong>Date of birth: </strong>{patient.birthDate}</p>
            <p><strong>Gender: </strong>{patient.gender}</p>
            <p><strong>Mobile number: </strong>{patient.mobileNumber}</p>
            <p>
            <strong>Emergency Contact: </strong>
            {patient.emergencyContact ? (
                <>
                <span>Name: {patient.emergencyContact.name}</span> <br/>
                <span>Phone Number: {patient.emergencyContact.mobileNumber}</span> <br/>
                <span>Relation to patient: {patient.emergencyContact.relation}</span>
                </>
            ) : (
                'N/A'
            )}
            </p>
            <p>
            <strong>Health Package: </strong>
            {patient.healthPackage ? (
                <>
                <span>Name: {patient.healthPackage.name}</span> <br/>
                <span>Doctor discount: {patient.healthPackage.doctorDiscount}</span>
                </>
            ) : (
                'N/A'
            )}
            </p>
        
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