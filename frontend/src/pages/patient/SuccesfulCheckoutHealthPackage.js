import {useState, useEffect} from 'react'
import axios from 'axios'

const SuccessfulCheckoutHealthPackage = () => {
    const patientId = "65763bc6b8ee85160043f31a"
    
    useEffect(() => {
        const verifyCheckout = async () => {
            const body = {}
            body['healthPackageId'] = localStorage.getItem('healthPackage')
            await axios.put('/buyHealthPackage?id='+patientId,body)
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