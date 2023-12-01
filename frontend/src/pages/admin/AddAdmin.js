import {useState} from 'react'
import axios from 'axios'

const AddAdmin  = () => {


    const [username , setName] = useState('');
    const [password, setPassword] = useState('');
    const [message , setMessage] = useState(null);

    const handleSubmit = async(e) => {
        e.preventDefault()
        const NewAdminData = {}
        if(username !=="")
        NewAdminData['username'] = username;
        if (password !== "")
        NewAdminData['password']=password;
        const response = await axios.post("/addAdmin", NewAdminData);
        //console.log(response)
        //console.log(response.data)
        alert(response.data);
    }

    return (
        <form className='edit'>
            <h3>Add Admin</h3>

            <label>Name :</label>
            <input
             type="text" 
             value={username}
             onChange={(e)=>setName(e.target.value)}
            />

            <label>Password :</label>
            <input
             type="password" 
             value={password}
             onChange={(e)=>setPassword(e.target.value)}
            />
           <p/>

            <button onClick={handleSubmit}>Add new Admin</button>
            {message && <h3>{message}</h3>}
        </form>
    )
}

export default AddAdmin ;