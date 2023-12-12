import {useState, useEffect} from 'react'
import axios from 'axios'
import PatientAuthorization from '../../components/PatientAuthorization'

const SuccessfulCheckoutHealthPackage = ({ user }) => {
    // const patientId = "65763bc6b8ee85160043f31a"
    
    useEffect(() => {
        const verifyCheckout = async () => {
            const body = {}
            body['healthPackageId'] = localStorage.getItem('healthPackage')
            body['name'] = localStorage.getItem('subscriberName')
            await axios.put('/buyHealthPackage?id='+user._id,body)
            body['message'] = "Subcscribed To HealthPackage"
            await axios.get('/sendCheckoutMail?id='+user._id, {params: body})
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

export default PatientAuthorization(SuccessfulCheckoutHealthPackage)