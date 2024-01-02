import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');

    if (!userToken) {
      window.location.href = '/login';
    } else {
      setShowContent(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get('/logout');

      if (response.data.success) {
        localStorage.removeItem('userToken');
        setShowContent(false);
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleChangePassword = () => {
    window.location.href = '/ChangePassword';
  };

  return (
    <div className='Home'>
      {showContent ? (
        <>
          <p>This project is still under construction; please use the paths in the URL to skip to the different pages.</p>
  
          <button onClick={handleLogout}>Logout</button>
  
          <button onClick={handleChangePassword}>Change Password</button>
        </>
      ) : 
null   }
    </div>
  );
  
};

export default Home;
