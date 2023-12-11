import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CancelSubscription = () => {
  const [isSubscriptionCanceled, setSubscriptionCanceled] = useState(false);
  const [hasHealthPackage, setHasHealthPackage] = useState(null);
  const id = "6575badad728c698d3d1d93d"

  useEffect(() => {
    // Fetch the patient data and check if they have a health package
    const fetchPatientData = async () => {
      try {
        await axios.get("/viewMySubscribedHealthPackage?id="+id)
        .then((res)=>{
          setHasHealthPackage(res.data)
          if(res.data.status=="cancelled")
            setSubscriptionCanceled(true);
        }).catch((err)=>console.log(err))
      } catch (error) {
        console.error('Error fetching patient data:', error.message);
      }
    };

    fetchPatientData();
  }, [id]);

  const handleCancelSubscription = async () => {
    try {
      const response = await axios.put("/CancelSubscription?id="+id);
      console.log(response.data);
      setSubscriptionCanceled(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error canceling subscription:', error.message);
    }
  };

  return (
    <div>
      {hasHealthPackage && !isSubscriptionCanceled ? (
        <button onClick={handleCancelSubscription}>Cancel Subscription</button>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default CancelSubscription;