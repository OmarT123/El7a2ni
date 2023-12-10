import {useState, useEffect} from 'react'
import axios from 'axios'

const SuccessfulCheckoutHealthPackage = () => {
    const patientId = "6575badad728c698d3d1d93d"
    
    useEffect(() => {
        const verifyCheckout = async () => {
            const body = {}
            body['appointmentId'] = localStorage.getItem('healthPackageId')
            await axios.put('/reserveAppointment?id='+patientId,{params: body})
            body['message'] = "Appointment Booked"
            await axios.get('/sendCheckoutMail?id='+patientId, {params: body})
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

export default SuccessfulCheckoutHealthPackage