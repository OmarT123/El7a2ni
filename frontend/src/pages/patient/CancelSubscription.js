import React, { useState } from 'react';
import axios from 'axios';

const CancelSubscription = () => {
  const [isSubscriptionCanceled, setSubscriptionCanceled] = useState(false);
  const id = "657113afe3fca37dd4c6a22a"

  const handleCancelSubscription = async () => {
    try {
      const response = await axios.put("/CancelSubscription?id="+id);
      console.log(response.data);
      setSubscriptionCanceled(true);
    } catch (error) {
      console.error('Error canceling subscription:', error.message);
    }
  };

  return (
    <div>
      {isSubscriptionCanceled ? (
        <p>Subscription has been canceled successfully.</p>
      ) : (
        <button onClick={handleCancelSubscription}>Cancel Subscription</button>
      )}
    </div>
  );
};

export default CancelSubscription;