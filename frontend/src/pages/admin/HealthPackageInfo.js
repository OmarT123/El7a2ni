import axios from 'axios'
import {useEffect, useState} from 'react'
import AdminAuthorization from '../../components/AdminAuthorization'

const HealthPackageInfo = ({user}) => {
    const [healthPackage, setHealthPackage] = useState([])
    const [price, setPrice] = useState('')
    const [doctorDiscount, setDoctorDiscount] = useState('')
    const [medicineDiscount, setMedicineDiscount] = useState('')
    const [familyDiscount, setFamilyDiscount] = useState('')

    const getHealthPackage = async() => {
        const queryParams = new URLSearchParams(window.location.search)
        const id = queryParams.get('id')
        await axios.get("/getHealthPackage?id="+id).then(res => setHealthPackage(res.data)).catch(err => console.log(err.message))
    }
    useEffect(()=>{
        
        getHealthPackage()
    },[])


    const updateHealthPackage = async(e) => {
        e.preventDefault()
        const queryParams = new URLSearchParams(window.location.search)
        const id = queryParams.get('id')
        
        const body = {}
        if (price !== '')
            body["price"]=price
        if (doctorDiscount !== '')
            body["doctorDiscount"]=doctorDiscount
        if (medicineDiscount !== '')
            body["medicineDiscount"]=medicineDiscount
        if (familyDiscount !== '')
            body["familyDiscount"]=familyDiscount
        
        await axios.put("/editHealthPackage?id="+id,body).then(res=>alert(res.data)).catch(err=>console.log(err.message))

        getHealthPackage()
    }

    const deleteHealthPackage = async() => {
        const queryParams = new URLSearchParams(window.location.search)
        const id = queryParams.get('id')
        
        await axios.delete("/deleteHealthPackage?id="+id).then(res => alert(res.data)).catch(err=>console.log(err.message))
        window.location.href = "/HealthPackage"
    }

    return (
        <div className='search-container'>
            <form className='create'>
                <h3>Update Health Package</h3>

                <label>Price:</label>
                <input 
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                />

                <label>Doctor Discount:</label>
                <input 
                type="number"
                value={doctorDiscount}
                onChange={e => setDoctorDiscount(e.target.value)}
                />

                <label>Medicine Discount:</label>
                <input 
                type="number"
                value={medicineDiscount}
                onChange={e => setMedicineDiscount(e.target.value)}
                />

                <label>Family Discount:</label>
                <input 
                type="number"
                value={familyDiscount}
                onChange={e => setFamilyDiscount(e.target.value)}
                />

                <button onClick={updateHealthPackage}>Update</button>
            </form>
            <div className='search-results'>{
                healthPackage &&
                <div>
                    <h4>{healthPackage.name}</h4>
                    <p><b>Price:</b> {healthPackage.price} L.E</p>
                    <p><b>Doctor Discount:</b> {healthPackage.doctorDiscount} %</p>
                    <p><b>Medicine Discount:</b> {healthPackage.medicineDiscount} %</p>
                    <p><b>Family Discount:</b> {healthPackage.familyDiscount} %</p>
                    <button onClick={deleteHealthPackage}>Delete Health Package</button>
                </div>
            }</div>
        </div>
    )
}

export default AdminAuthorization(HealthPackageInfo) 
