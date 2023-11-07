import {useState} from 'react'
import axios from 'axios'

const DoctoreditForm  = () => {
    

    const [email, setMail] = useState('')
    const [hourlyRate, setRate] = useState(0)
    const [affiliation, setHospital] = useState('')
    const [message, setMessage] = useState(null)

    const handleSubmit = async(e) => {
        e.preventDefault()

        // temporarily hard coded id until a user is logged in
        const id = "65496e4a5c31c981636dc271"

        const doctorData = {}
        if (email !== '')
            doctorData['email']=email
        if (hourlyRate !== 0)
            doctorData['hourlyRate']=hourlyRate
        if (affiliation !== '')
            doctorData['affiliation']=affiliation
        const response = await axios.put("/editDoctor?id="+id,doctorData)
        setMessage(response.data)
    
    }

    return (
        <form className='edit'>
            <h3>Edit My Details</h3>

            <label>Email:</label>
            <input
             type="text" 
             value={email}
             onChange={(e)=>setMail(e.target.value)}
            />

            <label> Hourly Rate:</label>
            <input
             type="number" 
             min={0}
             value={hourlyRate}
             onChange={(e)=>setRate(e.target.value)}
            />

            <label> Hospital:</label>
            <input
             type="text"
             value = {affiliation} 
             onChange={(e)=>setHospital(e.target.value)}
            />

           <p/>

            <button onClick={handleSubmit}>Edit My Detalis</button>
        {message && <h3>{message}</h3>}
        </form>
    )
}

export default DoctoreditForm