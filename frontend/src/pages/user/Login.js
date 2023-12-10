import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');

    if (userToken) {
      window.location.href = '/Home';
    } else {
      setShowContent(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {};
    if (username !== '') userData['username'] = username;
    if (password !== '') userData['password'] = password;

    try {
      const response = await axios.post('/login', userData);
      setMessage(response.data);

      if (response.data.success) {
        localStorage.setItem('userToken', response.data.token);
        window.location.href = '/Home';
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    window.location.href = '/ResetPassword';
  };

  return (
    <>
      {showContent && (
        <form className='edit'>
          <h3>Login</h3>

          <label>Username:</label>
          <input type='text' value={username} onChange={(e) => setName(e.target.value)} />

          <label>Password:</label>
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
          <p />

          <button onClick={handleSubmit}>Login</button>
          <button onClick={handleResetPassword}>Reset Password</button>

          {/* Display the message on the frontend */}
          {message && <div style={{ color: message.success ? 'green' : 'red' }}>{message.message}</div>}
        </form>
      )}
    </>
  );
};

export default Login;
