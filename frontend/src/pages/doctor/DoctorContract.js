import { useEffect, useState } from 'react'
import axios from 'axios'
import DoctorAuthorization from '../../components/DoctorAuthorization'

const DoctorContract = ({ user }) => {

    const acceptContract = async() => {
        await axios.put('/acceptContract').then(res => alert(res.data))
        window.location.href = '/home'

    }

    const rejectContract = async() => {
        await axios.put("/rejectContract").then(res => alert(res.data))
        window.location.href = '/home'
        
    }

    return (
        <div className='contract'>
            <h3>Employment Contract</h3>
            <hr></hr>
            <div dangerouslySetInnerHTML={{ __html: user.contract }} className='contract'/>         
            <button onClick={acceptContract}>Accept</button>
            <button onClick={rejectContract}>Reject</button>
        </div>
    )
}

export default DoctorAuthorization(DoctorContract)