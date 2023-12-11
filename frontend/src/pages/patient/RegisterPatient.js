import axios from 'axios'
import {useState,useEffect} from 'react'

const RegisterPatient = () => {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [birthDate, setBirthDate] = useState(null)
    const [gender, setGender] = useState('')
    const [mobileNumber, setMobileNumber] = useState('')
    const [emergencyContact, setEmergencyContact] = useState({})
    const [showContent, setShowContent] = useState(false)
    const [responseMessage, setResponseMessage] = useState('');

     useEffect(() => {
    const userToken = localStorage.getItem('userToken');

    if (userToken) {
      window.location.href = '/Home';
    } else {
      setShowContent(true);
    }
  }, []);
    
    const register = async(e) => {
        e.preventDefault()

        if(!name || !username || !email || !password || !birthDate || !gender || !mobileNumber || !emergencyContact)
            alert('Please fill all the fields')
        else{
            const body = {name,username,email,password,birthDate,gender,mobileNumber,emergencyContact}
            await axios.post("/addPatient",body).then(res=>alert(res.data)).catch(err=>console.log(err))
        }
    }

    return (
        <div className="search-container">
            {showContent && (
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

                
                <label>Gender:</label>
                <select value={gender} onChange={(e)=>setGender(e.target.value)}>
                    <option value="">Select an option</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>

                
                <label>Mobile Number:</label>
                <input
                type="text"
                value={mobileNumber}
                onChange={(e)=>setMobileNumber(e.target.value)}
                />

                
                <h5>Emergecy Contact</h5>
                <label>Name:</label>
                <input
                type="text"
                onChange={(e)=>setEmergencyContact(prev => ({...prev, name:e.target.value}))}
                />

                <label>Mobile Number:</label>
                <input
                type="text"
                onChange={(e)=>setEmergencyContact(prev => ({...prev, mobileNumber:e.target.value}))}
                />

                <label>relation:</label>
                <select onChange={(e)=> setEmergencyContact(prev => ({...prev, mobileNumber:e.target.value}))}>
                <option value="">Select an option</option>
                <option value="husband">Husband</option>
                <option value="wife">Wife</option>
                <option value="son">Son</option>
                <option value="daughter">Daughter</option>
                </select>


                <button onClick={register}>Register</button>
            </form>
            )}
            <div className='search-results'></div>
        </div>
    )

}

export default RegisterPatient