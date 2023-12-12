import {useState, useEffect} from 'react'
import axios from 'axios'
import FreeAppointment from '../../components/patient/FreeAppointment'

const ViewFreeAppointments = () => {
    const [appointments, setAppointments] = useState([])
    const [name, setName] = useState('')

    useEffect(() => {
        const getAppointments = async () => {
            await axios.get("/ViewFreeAppointments").then(res => setAppointments(res.data))
        }
        getAppointments()
    }, [])

    const search = async(e) => {
        e.preventDefault()
        const body = {}
        body["name"] = name
        await axios.get("/viewFreeAppointmentsByName",{params:body}).then(res => setAppointments(res.data))
    }

    return (
        <div>
            <form>
                <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='Doctor name'
                />
                <button onClick={search}>Search</button>
            </form>
            {
                appointments.length > 0 && 
                appointments.map((appointment, index) => <FreeAppointment key={index} appointment={appointment}/>)
            }
        </div>
    )
}

export default ViewFreeAppointments