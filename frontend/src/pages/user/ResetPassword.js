import { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  const [username, setName] = useState('');
  const [message, setMessage] = useState(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const userData = {};
    if (username !== '') userData['username'] = username;

    try {
      const response = await axios.put('/resetPassword', userData);
      setMessage(response.data);
      console.log(response.data);

      if (response.data.success) {
         window.location.href = '/ResetPasswordOTP';
      }
    } catch (error) {
      console.error('Username error:', error);
    }
  };
 
  return (
    <form className='edit'>
      <h3>Reset Password</h3>
      <h4>Please enter your Username in order to get OTP by email :</h4>
      <label>Username :</label>
      <input type='text' value={username} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleResetPassword}>Send OTP</button>
      {message && <div style={{ color: message.success ? 'green' : 'red' }}>{message.message}</div>}
    </form>
  );
};

export default ResetPassword;
