import axios from 'axios'
import { useState,useEffect } from 'react'
import PatientAuthorization from '../../components/PatientAuthorization'

const Doctor = ({user}) => {
    const [doctor, setDoctor] = useState(null)

    useEffect(() => {
        const getDoctor = async()=> {
            const queryParams = new URLSearchParams(window.location.search)
            const id = queryParams.get('id')
            await axios.get('/selectDoctorFromFilterSearch?id='+id).then(res => setDoctor(res.data)).catch(err=>console.log(err.message))
            }

        getDoctor()
    },[])

    return (
        <div>
        {doctor && <div className='user-info'>
            <p><strong>name: </strong>{doctor.name}</p>
            <p><strong>email: </strong>{doctor.email}</p>
            <p><strong>birthDate: </strong>{doctor.birthDate}</p>
            <p><strong>hourlyRate: </strong>{doctor.hourlyRate}</p>
            <p><strong>affiliation: </strong>{doctor.affiliation}</p>
            <p><strong>educational background: </strong>{doctor.educationalBackground}</p>
            <p><strong>speciality: </strong>{doctor.speciality}</p>
        </div>}
        </div>
    )
}

export default PatientAuthorization(Doctor) 