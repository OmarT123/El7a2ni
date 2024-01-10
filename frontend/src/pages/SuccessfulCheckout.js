import { useState, useEffect } from 'react';
import axios from 'axios';

const SuccessfulCheckout = () => {
 

  useEffect(() => {
    const verifyCheckout = async () => {
      try {
        const response = await axios.get("/getUniqueCode");
        const uniqueCodeDB=response.data;
        const queryParams = new URLSearchParams(window.location.search);
        const uniqueCode = queryParams.get('code');
        if(uniqueCode !== uniqueCode)
            window.location.href='/'
        else{
           await axios.post("/createOrderPending");
           window.location.href='/';
        }

        
         

       
      } catch (error) {
        console.error(error);
       
      }
    };

    verifyCheckout();
  }, []);

  return (
    <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
  );
};

export default SuccessfulCheckout;
