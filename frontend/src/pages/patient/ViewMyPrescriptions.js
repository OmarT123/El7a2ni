import axios from 'axios'
import {useState , useEffect} from 'react'
import DisplayPrescription from '../../components/DisplayPrescription';
import PatientAuthorization from '../../components/PatientAuthorization';
import { Link } from 'react-router-dom';

const ViewMyPrescriptions = ({user}) => {

    const [message , setMessage] = useState(null);
    const [prescriptionList, setPrescriptionList] = useState([]);
    const [prescriptionsFilter, setPrescriptionsFilter] = useState(null)
    const [createdAt, setCreatedAt] = useState(null)
    const [doctor, setDoctor] = useState('')
    const [filled, setFilled] = useState(null)
    const [searchResults, setSearchResults] = useState(false)

    const FetchPrescriptions = async () => {
        try {
          const id = user._id
          const response = await axios.get('/viewMyPrescriptions');
          const list = response.data;
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

        const id = user._id
            const body = {}
            if (createdAt)
                body["date"] = createdAt
            if (filled === "true" || filled === "false")
                body["filled"]= filled === "true"?true:false
            if (doctor)
                body["doctor"]=doctor
                await axios
                .get("/filterPrescriptionByDateDoctorStatus", { params: body })
                .then((res) => {
                  if (typeof res.data === 'string') {
                    alert(res.data);
                  } else {
                    // If the response is an array, it's prescriptions
                    setPrescriptionsFilter(res.data);
                    setSearchResults(true);
                  }
                })
                .catch((err) => console.log(err.message));              
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
            <div>
              <h3 className='h3-viewmyPres'>My Prescriptions</h3>
              {(prescriptionList.length > 0 || prescriptionsFilter) && (
                <div>
                  {(prescriptionList.length > 0 && !searchResults) && (
                    <div>
                      {prescriptionList.map((prescription) => (
                        <div key={prescription._id} className="prescription-card">
                          <h4>Prescription Details:</h4>
                          <p>Doctor: {prescription.doctor.name}</p>
                          <p>Medicines:</p>
                          <ul>
                            {prescription.medicines.map((medicine) => (
                              <li key={medicine._id}>
                                {medicine.medId.name} - {medicine.dosage}
                              </li>
                            ))}
                          </ul>
                          <p>Prescription Date: {prescription.createdAt.substr(0, 10)}</p>
                          {!prescription.filled && <p>Filled: {prescription.filled? "" : "No"}</p>}
                          <Link to={`/SelectedPrescription?id=${prescription._id}`}>View Prescription</Link>
                        </div>
                      ))}
                    </div>
                  )}
                  {prescriptionsFilter && (
                    <div>
                      {prescriptionsFilter.map((prescription) => (
                        <div key={prescription._id} className="prescription-card">
                          <h4>Prescription Details:</h4>
                          <p>Doctor: {prescription.doctor}</p>
                          <p>Medicines:</p>
                          <ul>
                            {prescription.medicines.map((medicine) => (
                              <li key={medicine._id}>
                                {medicine.medId.name} - {medicine.dosage}
                              </li>
                            ))}
                          </ul>
                          <Link to={`/SelectedPrescription?id=${prescription._id}`}>View Prescription</Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {message && <h3>{message}</h3>}
            </div>
          </div>
        </div>
      );
}


export default PatientAuthorization(ViewMyPrescriptions) 
