import axios from 'axios'
import {useState,useEffect} from 'react'
import DoctorDetails from '../components/DoctorDetails'

const SearchDoctor = () => {
    const [name, setName] = useState('')
    const [speciality, setSpeciality] = useState('')
    const [doctors, setDoctors] = useState(null)

    const handleSubmit = async(e) => {
        e.preventDefault()

        const body = {}
        if (name !== '')
            body['name']=name
        if (speciality !== '')
            body['speciality']=speciality
        await axios.get("/searchDoctor",body)
        .then((res)=>{
            const docs = res.data
            //console.log(docs)
            setDoctors(docs)
        }).catch((err)=>console.log(err))
    }

    return (
        <div className='search-container'>
            <form className='create'>
                <h3>Search for a Doctor</h3>
                
                <label>Name:</label>
                <input
                type="text" 
                value={name}
                onChange={(e)=>setName(e.target.value)}
                />

                <label>Speciality:</label>
                <input
                type="text" 
                value={speciality}
                onChange={(e)=>setSpeciality(e.target.value)}
                />

                <button onClick={handleSubmit}>Search</button>
            </form>
            <div className='search-results'>
                {doctors && doctors.map((doctor)=>(
                    <DoctorDetails key={doctor._id} doctor={doctor}/>
                ))}
            </div>
        </div>
    )
}

export default SearchDoctor