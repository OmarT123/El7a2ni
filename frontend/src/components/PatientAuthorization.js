import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NotAuthorized from './NotAuthorized';

const PatientAuthorization = (WrappedComponent) => {
  const PatientAuthorization = (props) => {
    const [showContent, setShowContent] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const userToken = localStorage.getItem('userToken');

      if (!userToken) {
        navigate('/login');
      } else {
        const fetchData = async () => {
          try {
            const response = await axios.get('/loginAuthentication');
            const { success, type, user } = response.data;

            if (success) {
              if (type === 'patient') {
                setShowContent(true);
                setUser(user);
              } else {
                setShowContent(false);
              }
            } else {
              navigate('/login');
            }
          } catch (error) {
            console.error('User authentication error:', error);
            setError('Error during authentication');
          } finally {
            setLoading(false);
          }
        };

        fetchData();

        // Clean-up function
        return () => {
          // Perform any clean-up or cancellation here if needed
        };
      }
    }, [navigate]);

    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>Error: {error}</p>;
    }

    return <div>{showContent ? <WrappedComponent {...props} user={user}/> : <NotAuthorized />}</div>;
  };

  return PatientAuthorization;
};

export default PatientAuthorization;
