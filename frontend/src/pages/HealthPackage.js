import axios from 'axios'
import {useEffect, useState} from 'react'
import HealthPackageDetails from '../components/HealthPackageDetails'

const HealthPackage = () => {
    const [healthPackages, setHealthPackages] = useState(null)
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [doctorDiscount, setDoctorDiscount] = useState(0)
    const [medicineDiscount, setMedicineDiscount] = useState(0)
    const [familyDiscount, setFamilyDiscount] = useState(0)
    

    const getAllHealthPackages = async() => {
        await axios.get("/getAllHealthPackages").then(res=>setHealthPackages(res.data)).catch(err=>console.log(err.message))
    }

    const createHealthPackage = async(e) => {
        e.preventDefault()

        if (name === '' || price === 0)
            alert('Please insert name and price')
        else{
            const body = {name,price,doctorDiscount,medicineDiscount,familyDiscount}
            await axios.post("/addHealthPackage",body).then(res=>alert(res.data)).catch(err=>console.log(err.message))
            getAllHealthPackages()
        }
    }



    useEffect(()=> {
        getAllHealthPackages();
    },[])

    return (
        <div className='search-container'>
            <form className='create'>
                <h3>Add Health Package</h3>

                <label>Name:</label>
                <input 
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                />

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

                <button onClick={createHealthPackage}>Create</button>
            </form>
            <div className='search-results'>
                {healthPackages && healthPackages.map(hpackage => (<HealthPackageDetails key={hpackage._id} hpackage={hpackage} />))}
            </div>
        </div>
    )

}

export default HealthPackage