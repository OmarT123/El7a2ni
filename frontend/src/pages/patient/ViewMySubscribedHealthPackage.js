import axios from 'axios'
import {useState , useEffect} from 'react'
import { Navigate, useNavigate  } from 'react-router-dom';


const ViewMySubscribedHealthPackage = () => {

    const [HealthPackage, setHealthPackage] = useState(null);
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
      <h2>Subscribed Health Package</h2>
      {HealthPackage ? (
        <div>
         
          <p>Health Package Name: {HealthPackage.name}</p>
          <p>Price: {HealthPackage.price}</p>
          <p>Family Discount: {HealthPackage.familyDiscount}</p>
          <p>Doctor Discount: {HealthPackage.doctorDiscount}</p>
          <p>Medicine Discount: {HealthPackage.medicineDiscount}</p>
          <p>Status: {HealthPackage.status}</p>
          <p>End Date: {new Date(HealthPackage.endDate).toLocaleString().substring(0, 9)}</p>
          {/* Add more details as needed */}
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
