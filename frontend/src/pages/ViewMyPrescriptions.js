import axios from 'axios'
import {useState , useEffect} from 'react'
import DisplayPrescription from '../components/DisplayPrescription';

const ViewMyPrescriptions = () => {

    const [message , setMessage] = useState(null);
    const [prescriptionList, setPrescriptionList] = useState([]);
    const FetchPrescriptions = async () => {
        try {
          const id = "654814b4801a1dd510bd5b98";
          const response = await axios.get('/viewMyPrescriptions?id=' + id);
          const list = response.data;
        //   console.log(list[0].medicines)
          setPrescriptionList(list);
        } catch (error) {
          console.error("Error fetching prescriptions: ", error);
        }
      };
      useEffect(() => {
        FetchPrescriptions();
      }, []);
      
        

    return (
      <div className="view-prescriptions-container">
        
               <h3 className='h3-viewmyPres'>My Prescriptions</h3>
           {prescriptionList.length > 0 && prescriptionList.map((prescription) => (
                <div key={prescription._id} className="prescription-card">
                    <DisplayPrescription key={prescription._id} prescription={prescription}/>
  
                   </div> 
                    
                   

  ))}
  {message && <h3>{message}</h3>}
</div>
      )
}


export default ViewMyPrescriptions
