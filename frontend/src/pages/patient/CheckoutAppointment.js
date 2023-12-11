import {useEffect, useState} from 'react';
import axios from 'axios';

const CheckoutAppointment = () => {
    const [familyMembers, setFamilyMembers] = useState([])
    const [selectedFamilyMember, setSelectedFamilyMember] = useState('')
    const [appointment, setAppointment] = useState(0)
    const patientId = "6575badad728c698d3d1d93d"

    useEffect(() => {
        const getFamilyMembers = async() => {
            await axios.get("/getFamilyMembers?id="+patientId).then(res => setFamilyMembers(res.data))
        }
        const getAppointment = async() => {
            const appointmentId = localStorage.getItem('appointment')
            await axios.get("/getAnAppointment?id="+appointmentId,{params:{patientId}}).then(res => setAppointment(res.data))
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
        if (selectedFamilyMember === '')
            alert('Please Select a family member')
        else
            await axios.get("/payWithWallet?id="+patientId,{params: body}).then(res => window.location.href = res.data.url).catch(err => console.log(err))
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
            <option value="PATIENT NAME">PATIENT NAME</option>
            {familyMembers.length > 0 && familyMembers.map((member, index) => {
                return <option key={index} value={member}>{member.name}</option>
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

export default CheckoutAppointment
