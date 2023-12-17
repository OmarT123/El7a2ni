import {useState, useEffect} from 'react'
import axios from 'axios'
import PatientAuthorization from '../../components/PatientAuthorization';
const SuccessfulCheckout = () => {
    
    useEffect(() => {
        const verifyCheckout = async () => {
            const body = {}
            body['message'] = "Order Placed"
            await axios.get('/sendCheckoutMail',{params: body})
            window.location.href = '/PastOrders'
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

export default PatientAuthorization(SuccessfulCheckout)