import {useEffect, useState} from 'react';
import axios from 'axios';

const CheckoutHealthPackage = () => {
    const [familyMembers, setFamilyMembers] = useState([])
    const [selectedFamilyMember, setSelectedFamilyMember] = useState('')
    const [healthPackage, setHealthPackage] = useState(0)
    const patientId = "65763bc6b8ee85160043f31a"

    useEffect(() => {
        const getFamilyMembers = async() => {
            await axios.get("/getFamilyMembers?id="+patientId).then(res => setFamilyMembers(res.data))
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
        body['item']={name:healthPackage.name, price:healthPackage.price}
        if (selectedFamilyMember === '')
            alert('Please Select a family member')
        else
            await axios.get("/payWithCard", {params: body}).then(res => window.location.href = res.data.url).catch(err => console.log(err))        
    }

    const payWithWallet = async () => {
        const body = {}
        body['url']='SuccessfulCheckoutHealthPackage'
        body['price']=healthPackage.price
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
        <p>{healthPackage.price} €</p>
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

export default CheckoutHealthPackage
