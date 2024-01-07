import axios from 'axios'
import {useState , useEffect} from 'react'
import PatientAuthorization from "../../components/PatientAuthorization";

const RequestFollowup = () => {
    const [appointments, setAppointments] = useState([])

    useEffect(() => {
        const getAppointments = async () => {
            await axios.get("/ViewFreeAppointments").then(res => setAppointments(res.data))
        }
        getAppointments()
    }, [])

    const reserveAppointment = (id) => {
        localStorage.setItem('appointment', id)
        localStorage.setItem('f', true);
        window.location.href = '/CheckoutAppointment'
    }

    return (
        <div>
            <h3>Free Appointment Slots: </h3>
            {
                appointments.length > 0 && 
                appointments.map((appointment) => 
                <>
                <div>Status: {appointment.appointment.status}</div>
                <div>Date: {appointment.appointment.date.substr(0, 10)}</div>
                <div>Time: {appointment.appointment.date.substr(11, 5)}</div>
                <div>Doctor: {appointment.appointment.doctor && appointment.appointment.doctor.name}</div>
                <div>Price: {appointment.price}</div>
                <button onClick={() => reserveAppointment(appointment.appointment._id)}>Reserve</button>
                <hr />
                </>)
            }
        </div>
    )
};

export default PatientAuthorization(RequestFollowup)