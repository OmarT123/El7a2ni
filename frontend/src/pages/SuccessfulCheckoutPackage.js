import { useState, useEffect } from 'react';
import axios from 'axios';

const SuccessfulCheckoutPackage = () => {
 

  useEffect(() => {
    const verifyCheckout = async () => {
      try {
        const response = await axios.get("/getUniqueCode");
        const uniqueCodeDB=response.data;
        const queryParams = new URLSearchParams(window.location.search);
        const uniqueCode = queryParams.get('code');
        const id=queryParams.get('id');
        const name=queryParams.get('name');
        console.log(uniqueCodeDB)
        console.log(uniqueCode)
        if(uniqueCode !== uniqueCode)
            window.location.href='/'
        else{
           await axios.put("buyHealthPackage", {name : name, healthPackageId: id});
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

export default SuccessfulCheckoutPackage;
