import React from 'react';
import ViewMySubscribedHealthPackage from './ViewMySubscribedHealthPackage';
import PatientAuthorization from '../../components/PatientAuthorization';

const ViewSubscribedHealthPackageAndCancel = () => {
  return (
    <div>
      <h1>My Health Page</h1>
      <ViewMySubscribedHealthPackage />
      
     

    </div>
    
  );
  
};

export default PatientAuthorization(ViewSubscribedHealthPackageAndCancel);