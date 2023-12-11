import { useState, useEffect } from 'react';
import axios from 'axios';

const ResetPasswordOTP = () => {
  const [username, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    const resetPasswordDone = localStorage.getItem('resetPasswordDone')

    if (userToken) {
      window.location.href = '/home';
    } else {
      if(resetPasswordDone){
        setShowContent(true);

      }
      else {
        window.location.href= '/NotAuthorized'
      }

    }
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!showContent) {
      window.location.href = '/resetPassword';
      return;
    }

    const userData = {};
    if (username !== '') userData['username'] = username;
    if (otp !== '') userData['otp'] = otp;
    if (newPassword !== '') userData['newPassword'] = newPassword;

    try {
      const response = await axios.put('/resetPasswordWithOTP', userData);
      setMessage(response.data);

      if (response.data.success) {
        window.location.href = '/Login';
      }
    } catch (error) {
      console.error('OTP error:', error);
    }
  };

  return (
    <form className='edit'>
      {showContent && (
        <>
          <h3>Reset Password</h3>
          <h4>Please enter your Username in order to get OTP by email :</h4>

          <label>Username :</label>
          <input type='text' value={username} onChange={(e) => setName(e.target.value)} />

          <label>OTP :</label>
          <input type='password' value={otp} onChange={(e) => setOtp(e.target.value)} />
          <label>New Password :</label>
          <input type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

          <button onClick={handleResetPassword}>Reset Password </button>

          {/* Display the message on the frontend */}
          {message && (
            <div style={{ color: message.success ? 'green' : 'red' }}>{message.message}</div>
          )}
        </>
      )}
    </form>
  );
};

export default ResetPasswordOTP;
