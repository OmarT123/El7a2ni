import axios from 'axios'
import {useState , useEffect} from 'react'
import { Navigate, useNavigate  } from 'react-router-dom';
import CancelSubscription from './CancelSubscription'; 

const ViewMySubscribedHealthPackage = () => {

    const [HealthPackage, setHealthPackage] = useState([]);
    const id = "6575badad728c698d3d1d93d"
    const navigate = useNavigate ();

  useEffect(() => {
    const fetchHealthPackage= async () => {
      try {
        await axios.get("/viewMySubscribedHealthPackage?id="+id)
        .then((res)=>{
            setHealthPackage(res.data)
        }).catch((err)=>console.log(err))
    

      } catch (error) {
        console.error('Error fetching Health Package data:', error.message);
      }
    };
    fetchHealthPackage()
    ;
  }, []);

  return (
    <div>
      <h2>Subscribed Health Packages</h2>
      {HealthPackage && HealthPackage.length > 0 ? (
        <div>
          {HealthPackage.map((packageItem, index) => (
            <div key={index}>
              <p>Name of package owner: {packageItem.patientName}</p>
              <p>Health Package Name: {packageItem.name}</p>
              <p>Price: {packageItem.price}</p>
              <p>Family Discount: {packageItem.familyDiscount}</p>
              <p>Doctor Discount: {packageItem.doctorDiscount}</p>
              <p>Medicine Discount: {packageItem.medicineDiscount}</p>
              <p>Status: {packageItem.status}</p>
              <p>End Date: {new Date(packageItem.endDate).toLocaleString().substring(0, 9)}</p>
              <CancelSubscription />
              <hr />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>Not subscribed to any health package</p>
          <button onClick={() => navigate('/ViewHealthPackages')}>
            View Available Health Packages
          </button>
        </div>
      )}
    </div>
  );
  
};


export default ViewMySubscribedHealthPackage
