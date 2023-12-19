import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');

    if (!userToken) {
      window.location.href = '/login';
    } else {
      setShowContent(true);
    }
  }, []);

  const handleChangePassword = async () => {
    try {
      const response = await axios.put('/changePassword', {
        oldPassword,
        newPassword,
      });

      setMessage(response.data);
    } catch (error) {
      console.error('Change Password error:', error);
    }
  };

  return (
    <div>
      {showContent && (
        <form>
          <h3>Change Password</h3>

          <label>Old Password:</label>
          <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />

          <label>New Password:</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

          <button type="button" onClick={handleChangePassword}>
            Change Password
          </button>

          {message && <div style={{ color: message.success ? 'green' : 'red' }}>{message.message}</div>}
        </form>
      )}
    </div>
  );
};

export default ChangePassword;
