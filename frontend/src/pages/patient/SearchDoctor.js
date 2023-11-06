import axios from 'axios'
import {useState,useEffect} from 'react'
import DoctorDetails from '../../components/patient/DoctorDetails'

const SearchDoctor = () => {
    const [name, setName] = useState('')
    const [speciality, setSpeciality] = useState('')
    const [doctors, setDoctors] = useState(null)
    const [date, setDate] = useState(null)

    const handleSubmit = async(e) => {
        e.preventDefault()

        const body = {}
        if (name !== '')
            body['name']=name
        if (speciality !== '')
            body['speciality']=speciality
        await axios.get("/searchDoctor",{params : body})
        .then((res)=>{
            const docs = res.data
            //console.log(docs)
            setDoctors(docs)
        }).catch((err)=>console.log(err))
    }

    const displayAll = async(e) => {
        e.preventDefault()

        //temporary id
        const id = "6546851fd349b37530412e8d"
        await axios.get("/allDoctors?id="+id)
        .then((res)=>{
            const docs = res.data
            setDoctors(docs)
        }).catch((err)=>console.log(err))
    }

    const searchSpecialityDate = async(e) => {
        e.preventDefault()

        const body = {}
        if (date !== null)
            body['date']=date
        if (speciality !== '')
            body['speciality']=speciality
        await axios.get("/filterDoctorsSpecialityDate",{params : body})
        .then((res)=>{
            const docs = res.data
            //console.log(docs)
            setDoctors(docs)
        }).catch((err)=>console.log(err))
    }

    return (
        <div className='search-container'>
            <div className='form-container'>
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
                    <button onClick={displayAll}>View All Doctors</button>
                </form>
                <form className='create'>
                    <h3>Search by speciality/Availability</h3>

                    <label>Speciality:</label>
                    <input 
                    type="text" 
                    value={speciality} 
                    onChange={(e)=>setSpeciality(e.target.value)}
                    />

                    <label>Date:</label>
                    <input
                    type="date"
                    value={date}
                    onChange={(e)=>setDate(e.target.value)}
                    />

                    <button onClick={searchSpecialityDate}>Search</button>
                </form>
            </div>
            <div className='search-results'>
                {doctors && doctors.map((doctor)=>(
                    <DoctorDetails key={doctor._id} doctor={doctor}/>
                ))}
            </div>
        </div>
    )
}

export default SearchDoctor