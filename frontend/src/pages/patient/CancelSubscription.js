import React, { useState } from 'react';
import axios from 'axios';

const CancelSubscription = () => {
  const [isSubscriptionCanceled, setSubscriptionCanceled] = useState(false);
  const id = "657497dcb59b327adbc4229b"

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
      {isSubscriptionCanceled ? (
        <p>Subscription has been canceled successfully.</p>
      ) : (
        <button onClick={handleCancelSubscription}>Cancel Subscription</button>
      )}
    </div>
  );
};

export default CancelSubscription;