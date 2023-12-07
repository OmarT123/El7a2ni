import axios from 'axios'
import {useState , useEffect} from 'react'


const ViewMyPrescriptions = () => {

    const [HealthPackage, setHealthPackage] = useState(null);
    const id = "6571009d25046534ac0de556"

  useEffect(() => {
    const fetchHealthPackage= async () => {
      try {
        await axios.get("/viewMySubscribedHealthPackage?id="+id)
        .then((res)=>{
            setHealthPackage(res.data)
            console.log(res.data)
        }).catch((err)=>console.log(err))
    

      } catch (error) {
        console.error('Error fetching Health Package data:', error.message);
      }
    };
    fetchHealthPackage()
    ;
  }, [id]);

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
          {/* Add more details as needed */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};


export default ViewMyPrescriptions
