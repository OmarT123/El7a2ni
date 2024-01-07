import {useEffect, useState} from 'react';
import axios from 'axios';

import PatientAuthorization from '../../components/PatientAuthorization'

const CheckoutAppointment = ({ user }) => {
    const [familyMembers, setFamilyMembers] = useState([])
    const [selectedFamilyMember, setSelectedFamilyMember] = useState('')
    const [appointment, setAppointment] = useState(0)

    useEffect(() => {
        const getFamilyMembers = async() => {
            await axios.get("/getFamilyMembers?id="+user._id).then(res => setFamilyMembers(res.data))
        }
        const getAppointment = async() => {
            const appointmentId = localStorage.getItem('appointment')
            await axios.get("/getAnAppointment?id="+appointmentId,{params:{patientId: user._id}}).then(res => setAppointment(res.data))
        }
        getFamilyMembers()
        getAppointment()
    }, [])

    const payWithCard = async () => {
        const body = {}
        body['url']='SuccessfulCheckoutAppointment'
        // console.log(appointment)
        body['item']={name:"Appointment", price:appointment.price}
        body['type'] = 'appointment'

        localStorage.setItem('attendantName', selectedFamilyMember)
        if (selectedFamilyMember === '')
            alert('Please Select a family member')
        else
            await axios.get("/payWithCard", {params: body}).then(res => window.location.href = res.data.url).catch(err => console.log(err))        
    }

    const payWithWallet = async () => {
        const body = {}
        body['url']='SuccessfulCheckoutAppointment'
        body['price']=appointment.price
        body['type'] = 'appointment'
        localStorage.setItem('attendantName', selectedFamilyMember)
        if (selectedFamilyMember === '')
            alert('Please Select a family member')
        else
        await axios.get("/payWithWallet?id="+user._id, { params: body })
        .then(res => {
          if (res.data.success === true) {
            window.location.href = res.data.url;
          } else {
            alert("Payment failed: " + res.data.message);
          }
        })
        .catch(err => console.log(err));      
    }

    const handleFamilyMemberSelect = async (event) => {
        setSelectedFamilyMember(event.target.value)
    }

  return (
    <div className='checkout'>
        <h3>Total:</h3>
        <p>{appointment.price} €</p>
        <h3>Choose Family Member</h3>
        <select onChange={handleFamilyMemberSelect} value={selectedFamilyMember}>
            <option value="">Family Members...</option>
            <option value={user.name}>{user.name}</option>
            {familyMembers.length > 0 && familyMembers.map((member, index) => {
                return <option key={index} value={member.name}>{member.name}</option>
            }
            )}
        </select>
        <h3>Choose Payment Method:</h3>
        <hr></hr>
        <button onClick={payWithCard}>Card</button>
        <button onClick={payWithWallet}>Wallet</button>
    </div>
  )
}

export default PatientAuthorization(CheckoutAppointment)
