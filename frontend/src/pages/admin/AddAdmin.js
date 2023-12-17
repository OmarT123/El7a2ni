import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NotAuthorized from '../../components/NotAuthorized';
import AdminAuthorization from '../../components/AdminAuthorization';

const AddAdmin = ({ user }) => {
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [showContent, setShowContent] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAdminData = {};
    if (username !== '') newAdminData['username'] = username;
    if (password !== '') newAdminData['password'] = password;

    try {
      const response = await axios.post('/addAdmin', newAdminData);
      setMessage(response.data);
    } catch (error) {
      console.error('Add Admin error:', error);
    }
  };

  return (
    <div>
        <form className='edit'>
          <>
            <h3>Add Admin</h3>

            <label>Name :</label>
            <input type="text" value={username} onChange={(e) => setName(e.target.value)} />

            <label>Password :</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <p />

            <button onClick={handleSubmit}>Add new Admin</button>
            {message && <h3>{message}</h3>}
          </>
        </form>

    </div>
  );
};

export default AdminAuthorization(AddAdmin);
