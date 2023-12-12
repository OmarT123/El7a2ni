import {useEffect, useState} from 'react';
import axios from 'axios';
import PatientAuthorization from '../../components/PatientAuthorization';

const CheckoutHealthPackage = ({ user }) => {
    const [familyMembers, setFamilyMembers] = useState([])
    const [selectedFamilyMember, setSelectedFamilyMember] = useState('')
    const [healthPackage, setHealthPackage] = useState(0)
    // const patientId = "65763bc6b8ee85160043f31a"

    useEffect(() => {
        const getFamilyMembers = async() => {
            await axios.get("/getFamilyMembers").then(res => setFamilyMembers(res.data))
        }
        const getHealthPackage = async() => {
            const healthPackageId = localStorage.getItem('healthPackage')
            await axios.get("/getHealthPackageForPatient?id="+healthPackageId).then(res => setHealthPackage(res.data))
        }
        getFamilyMembers()
        getHealthPackage()
    }, [])

    const payWithCard = async () => {
        const body = {}
        body['url']='SuccessfulCheckoutHealthPackage'
        body['item']={name:healthPackage.hpackage.name, price:(healthPackage.hpackage.price - healthPackage.discount)}
        if (selectedFamilyMember === '')
            alert('Please Select a family member')
        else
            {
                localStorage.setItem('subscriberName', selectedFamilyMember)
                await axios.get("/payWithCard", {params: body}).then(res => window.location.href = res.data.url).catch(err => console.log(err))}        
    }

    const payWithWallet = async () => {
        const body = {}
        body['url']='SuccessfulCheckoutHealthPackage'
        body['price']=healthPackage.hpackage.price
        if (selectedFamilyMember === '')
            alert('Please Select a family member')
        else
            {
                localStorage.setItem('subscriberName', selectedFamilyMember)
                await axios.get("/payWithWallet",{params: body}).then(res => window.location.href = res.data.url).catch(err => console.log(err))
    }

    const handleFamilyMemberSelect = async (event) => {
        setSelectedFamilyMember(event.target.value)
        const healthPackageId = localStorage.getItem('healthPackage')
        if (event.target.value === user.name)
            {
                await axios.get("/getHealthPackageForPatient?id="+healthPackageId).then(res => setHealthPackage(res.data))}
        else
            await axios.get("/getHealthPackageForFamily?id="+healthPackageId,{params:{patientId: user._id, name: event.target.value}}).then(res => setHealthPackage(res.data))
    
    }

  return (
    <div className='checkout'>
        <h3>Total:</h3>
        {/* {console.log(healthPackage)} */}
        {healthPackage && <p>{healthPackage.hpackage.price * (1 - healthPackage.discount/100)} €</p>}
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

export default PatientAuthorization(CheckoutHealthPackage);
