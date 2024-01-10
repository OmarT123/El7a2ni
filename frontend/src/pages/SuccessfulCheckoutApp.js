import { useState, useEffect } from 'react';
import axios from 'axios';

const SuccessfulCheckoutApp = () => {
 

  useEffect(() => {
    const verifyCheckout = async () => {
      try {
        const response = await axios.get("/getUniqueCode");
        const uniqueCodeDB=response.data;
        const queryParams = new URLSearchParams(window.location.search);
        const uniqueCode = queryParams.get('code');
        const name= queryParams.get('name');
        const f= queryParams.get('f');
        const date= queryParams.get('date');
        const appointmentId=queryParams.get('appointmentId');

        if(uniqueCode !== uniqueCode)
            window.location.href='/'
        else{
      const body = {};
       body["appointmentId"] = appointmentId;
       body["name"] = name;
      body["f"] = f;
      body["date"] = date;
      const response = await axios.put("/reserveAppointment", body);
      //console.log(response.data)
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

export default SuccessfulCheckoutApp;
