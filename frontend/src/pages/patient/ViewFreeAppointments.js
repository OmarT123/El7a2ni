import {useState, useEffect} from 'react'
import axios from 'axios'
import FreeAppointment from '../../components/patient/FreeAppointment'

const ViewFreeAppointments = () => {
    const [appointments, setAppointments] = useState([])

    useEffect(() => {
        const getAppointments = async () => {
            await axios.get("/ViewFreeAppointments").then(res => setAppointments(res.data))
        }
        getAppointments()
    }, [])

   

    return (
        <div>
            {
                appointments.length > 0 && 
                appointments.map((appointment, index) => <FreeAppointment key={index} appointment={appointment}/>)
            }
        </div>
    )
}

export default ViewFreeAppointments