import { useEffect, useState } from 'react'
import axios from 'axios'
import DoctorAuthorization from '../../components/DoctorAuthorization'

const DoctorContract = ({ user }) => {
    

    const acceptContract = async() => {
        await axios.put('/acceptContract')
    }

    const rejectContract = async() => {
        await axios.put("/rejectContract")
    }

    return (
        <div>
            <h3>Employment Contract</h3>
            <hr></hr>
            <iframe title="PDF Viewer" src={user.contract} width="90%" height="600px" />            
            <button onClick={acceptContract}>Accept</button>
            <button onClick={rejectContract}>Reject</button>
        </div>
    )
}

export default DoctorAuthorization(DoctorContract)