import React from 'react';
import CancelSubscription from './CancelSubscription'; // Update the path accordingly
import ViewMySubscribedHealthPackage from './ViewMySubscribedHealthPackage'; // Update the path accordingly

const ViewSubscribedHealthPackageAndCancel = () => {
  return (
    <div>
      <h1>My Health Page</h1>
      <ViewMySubscribedHealthPackage />
      <hr /> {/* Add a horizontal line for separation */}
      <CancelSubscription />
     

    </div>
    
  );
  
};

export default ViewSubscribedHealthPackageAndCancel;