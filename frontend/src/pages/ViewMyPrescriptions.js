import axios from 'axios'
import {useState , useEffect} from 'react'
import DisplayPrescription from '../components/DisplayPrescription';

const ViewMyPrescriptions = () => {

    const [message , setMessage] = useState(null);
    const [prescriptionList, setPrescriptionList] = useState([]);
    const [prescriptionsFilter, setPrescriptionsFilter] = useState(null)
    const [createdAt, setCreatedAt] = useState(null)
    const [doctor, setDoctor] = useState('')
    const [filled, setFilled] = useState(null)
    const [searchResults, setSearchResults] = useState(false)

    const FetchPrescriptions = async () => {
        try {
          const id = "654814b4801a1dd510bd5b98";
          const response = await axios.get('/viewMyPrescriptions?id=' + id);
          const list = response.data;
        //   console.log(list[0].medicines)
          setPrescriptionList(list);
          setSearchResults(false)
        } catch (error) {
          console.error("Error fetching prescriptions: ", error);
        }
      };
      useEffect(() => {
        FetchPrescriptions();
      }, []);
      
      const search = async(e) => {
        e.preventDefault()

        const id = "654814b4801a1dd510bd5b98"
            const body = {}
            if (createdAt)
                body["createdAt"] = createdAt
            if (filled === "true" || filled === "false")
                body["filled"]= filled === "true"?true:false
            if (doctor)
                body["doctor"]=doctor
            // console.log(body)
            await axios.get("/filterPrescriptionByDateDoctorStatus?id="+id,{params:body}).then(res=>setPrescriptionsFilter(res.data)).catch(err=>console.log(err.message))
            setSearchResults(true)        
      }

        

    return (
        <div className='search-container'>
            <form className='create'>
                <h3>Search for Prescription</h3>

                <label>Date:</label>
                <input 
                type="date"
                value={createdAt}
                onChange={(e)=>setCreatedAt(e.target.value)}
                />

                <label>Doctor Name:</label>
                <input 
                type="text"
                value={doctor}
                onChange={(e)=>setDoctor(e.target.value)}
                />

                <label>Status:</label>
                <select value={filled} onChange={(e)=>setFilled(e.target.value)}>
                <option value="">Select an option</option>
                <option value="true">Filled</option>
                <option value="false">Not Filled</option>
                </select>

                <button onClick={search}>Search</button>
                <button onClick={FetchPrescriptions}>Show All Prescriptions</button>
            </form>
            <div className="search-results view-prescriptions-container">
            
                {!searchResults && <div><h3 className='h3-viewmyPres'>My Prescriptions</h3>
                    {prescriptionList.length > 0 && prescriptionList.map((prescription) => (
                        <div key={prescription._id} className="prescription-card">
                            <DisplayPrescription key={prescription._id} prescription={prescription}/>
                    </div> 
                    ))}
                {message && <h3>{message}</h3>}</div>}
                {prescriptionsFilter && 
                    <div>
                        <h3 className='h3-viewmyPres'>My Prescriptions</h3>
                    {prescriptionsFilter.map((prescription) => (
                        <div key={prescription._id} className="prescription-card">
                            <DisplayPrescription key={prescription._id} prescription={prescription}/>
                    </div>
                ))}
                    </div>
                }
            </div>
            </div>

    )
}


export default ViewMyPrescriptions
