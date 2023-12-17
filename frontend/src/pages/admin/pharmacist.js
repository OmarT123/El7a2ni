import axios from 'axios'
import { useState,useEffect } from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import AdminAuthorization from '../../components/AdminAuthorization'

const Pharmacist = ({user}) => {
    const [pharmacist, setPharmacist] = useState(null)

    useEffect(() => {
        const getPharmacist = async()=> {
            const queryParams = new URLSearchParams(window.location.search)
            const id = queryParams.get('id');
        await axios.get('/viewPharmacist?id='+id).then(res => setPharmacist(res.data)).catch(err=>console.log(err.message))
        }

        getPharmacist()
    },[])

    return (
        <div className="home">
            {pharmacist &&
        <div className="pharmacist-details">
            <h4>{pharmacist.name}</h4>
            <p><strong>Username: </strong>{pharmacist.username}</p>
            <p><strong>Email: </strong>{pharmacist.email}</p>
            <p><strong>Date of birth: </strong>{pharmacist.birthDate}</p>
            <p><strong>Hourly Rate: </strong>{pharmacist.hourlyRate}</p>
            <p><strong>Affiliation: </strong>{pharmacist.affiliation}</p>
            <p><strong>Educational Background: </strong>{pharmacist.educationalBackground}</p>
            <p>Date/Time registered: {formatDistanceToNow(new Date(pharmacist.createdAt),{addSuffix: true})}</p>
      </div>}
        </div>
)
}

export default AdminAuthorization(Pharmacist) 