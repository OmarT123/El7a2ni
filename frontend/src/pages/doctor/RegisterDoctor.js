import axios from 'axios'
import {useState} from 'react'
import RegisterPatient from '../patient/RegisterPatient'
import DoctorAuthorization from '../../components/DoctorAuthorization'

const RegisterDoctor = () => {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [hourlyRate, setHourlyRate] = useState(0)
    const [affiliation, setAffiliation] = useState('')
    const [speciality, setSpeciality] = useState('')
    const [education1, setEducation1] = useState('')
    const [education2, setEducation2] = useState('')
    const [education3, setEducation3] = useState('')
    
    
    const register = async(e) => {
        e.preventDefault()

        const educationalBackground = []
        if (education1 !== '')
            educationalBackground.push(education1)
        if (education2 !== '')
            educationalBackground.push(education2)
        if (education3 !== '')
            educationalBackground.push(education3)
        if(!name || !username || !email || !password || !birthDate || !hourlyRate || !affiliation || !educationalBackground)
            alert('Please fill all the fields')
        else{
            const body = {name,username,email,password,birthDate,hourlyRate,affiliation,educationalBackground,speciality   }
            await axios.post("/addDoctor",body).then(res=>alert(res.data)).catch(err=>console.log(err))
        }
    }

    return (
        <div className="search-container">
            <form className='create'>
                <h3>Create new Account</h3>

                <label>Name:</label>
                <input
                type="text"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                />

                <label>Username:</label>
                <input
                type="text"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                />

                <label>Email:</label>
                <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />

                <label>Password:</label>
                <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />

                <label>Birth Date:</label>
                <input
                type="date"
                value={birthDate}
                onChange={(e)=>setBirthDate(e.target.value)}
                />
                
                <label>Hourly Rate:</label>
                <input
                type="number"
                value={hourlyRate}
                onChange={(e)=>setHourlyRate(e.target.value)}
                />

                
                <label>Affiliation</label>
                <input
                type="text"
                value={affiliation}
                onChange={(e)=>setAffiliation(e.target.value)}
                />

                <label>Speciality</label>
                <input
                type="text"
                value={speciality}
                onChange={(e)=>setSpeciality(e.target.value)}
                />

                <label>Educational Background</label>
                <input
                type="text"
                value={education1}
                onChange={(e)=>setEducation1(e.target.value)}
                style={{marginBottom:"10px"}}
                />
                <input
                type="text"
                value={education2}
                onChange={(e)=>setEducation2(e.target.value)}
                style={{marginBottom:"10px"}}
                />
                <input
                type="text"
                value={education3}
                onChange={(e)=>setEducation3(e.target.value)}
                style={{marginBottom:"10px"}}
                />
                


                <button onClick={register}>Register</button>
            </form>
            <div className='search-results'></div>
        </div>
    )

}

export default RegisterDoctor