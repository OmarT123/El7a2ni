import {useState} from 'react'
import axios from 'axios'

const FamilyMemberForm  = ({handleClick}) => {
    const [name, setName] = useState('')
    const [nationalId, setNationalId] = useState('')
    const [age, setAge] = useState(0)
    const [gender, setGender] = useState('')
    const [relationToPatient, setRelationToPatient] = useState('')
    const [message, setMessage] = useState(null)

    const handleSubmit = async(e) => {
        e.preventDefault()

        // temporarily hard coded id until a user is logged in
        const id = "65412e405d731e77c33fbc4b"

        const familyMember = {name, nationalId, age, gender, relationToPatient}
        const response = await axios.post("/addFamilyMember?id="+id,familyMember)
        setMessage(response.data)
        handleClick()
    }

    return (
        <form className='create'>
            <h3>Add new Family Member</h3>

            <label>Name:</label>
            <input
             type="text" 
             value={name}
             onChange={(e)=>setName(e.target.value)}
            />

            <label>NationalID:</label>
            <input
             type="text" 
             value={nationalId}
             onChange={(e)=>setNationalId(e.target.value)}
            />

            <label>Age:</label>
            <input
             type="number"
             min={0}
             value = {age} 
             onChange={(e)=>setAge(e.target.value)}
            />

            <label>Gender:</label>
            <select value={gender} onChange={(e)=>setGender(e.target.value)}>
                <option value="">Select an option</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>

            <label>Relation To Patient:</label>
            <select value={relationToPatient} onChange={(e)=>setRelationToPatient(e.target.value)}>
                <option value="">Select an option</option>
                <option value="husband">Husband</option>
                <option value="wife">Wife</option>
                <option value="son">Son</option>
                <option value="daughter">Daughter</option>
            </select>

            <button onClick={handleSubmit}>Add Family Member</button>
        {message && <h3>{message}</h3>}
        </form>
    )
}

export default FamilyMemberForm