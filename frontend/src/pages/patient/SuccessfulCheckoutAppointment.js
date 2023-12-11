import {useState, useEffect} from 'react'
import axios from 'axios'

const SuccessfulCheckoutAppointment = () => {
    const patientId = "6575badad728c698d3d1d93d"
    
    useEffect(() => {
        const verifyCheckout = async () => {
            const body = {}
            body['appointmentId'] = localStorage.getItem('appointment')
            await axios.put('/reserveAppointment?id='+patientId,body).then(res=>console.log(res.data))
            body['message'] = "Booked Appointment"
            await axios.get('/sendCheckoutMail?id='+patientId, {params: body}).then(res=>console.log(res.data))
            window.location.href = '/'
        }
        verifyCheckout()
    }, [])

    return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
    )
}

export default SuccessfulCheckoutAppointment