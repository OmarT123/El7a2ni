import axios from 'axios'
import {useEffect, useState} from 'react'
import HealthPackageDetailsForClinic from '../../components/HealthPackageDetailsForClinic'


const ViewHealthPackages = () => {
    const [healthPackages, setHealthPackages] = useState(null)

    const getAllHealthPackages = async() => {
        await axios.get("/getAllHealthPackages").then(res=>setHealthPackages(res.data)).catch(err=>console.log(err.message))
    }

    useEffect(()=> {
        getAllHealthPackages();
    },[])
    


    return (
        <div className='search-container'>
            <div className='search-results'>
            {healthPackages && healthPackages.map(hpackage => (<HealthPackageDetailsForClinic key={hpackage._id} hpackage={hpackage} />))}
            </div>
        </div>
    )
}



export default ViewHealthPackages