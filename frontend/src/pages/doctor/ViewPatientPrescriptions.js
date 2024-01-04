import axios from 'axios'
import {useState , useEffect} from 'react'
import { Link } from 'react-router-dom';
import DoctorAuthorization from '../../components/DoctorAuthorization'

const ViewMyPrescriptions = ({ user }) => {
  const [message, setMessage] = useState(null);
  const [prescriptionList, setPrescriptionList] = useState([]);
  const [searchResults, setSearchResults] = useState(false);

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get('/viewPatientPrescriptions');
      const list = response.data;
      setPrescriptionList(list);
      setSearchResults(false);
    } catch (error) {
      console.error("Error fetching prescriptions: ", error);
    }
  };

  const handleDeleteMedicine = async (prescriptionId, medId) => {
    try {
      const response = await axios.post('/deleteFromPrescription', {
        prescriptionId,
        medId,
      });
      setMessage(response.data.message);
      fetchPrescriptions(); // Refresh the prescription list after deletion
    } catch (error) {
      console.error('Error deleting medicine from prescription:', error.message);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  return (
    <div className="search-results view-prescriptions-container">
      <div>
        <h3 className="h3-viewmyPres">My Patients' Prescriptions</h3>
        {prescriptionList.length > 0 && (
          <div>
            {prescriptionList.map((prescription) => (
              <div key={prescription._id} className="prescription-card">
                <h4>Prescription Details:</h4>
                <p>Patient: {prescription.patient.name}</p>
                <p>Medicines:</p>
                <ul>
                  {prescription.medicines.map((medicine) => (
                    <li key={medicine._id}>
                      {medicine.medId.name} - {medicine.dosage}
                      <button onClick={() => handleDeleteMedicine(prescription._id, medicine.medId._id)}>
                        Delete Medicine
                      </button>
                    </li>
                  ))}
                </ul>
                <p>Prescription Date: {prescription.createdAt.substr(0, 10)}</p>
                {!prescription.filled && <p>Filled: {prescription.filled ? "" : "No"}</p>}
                <Link to={`/SelectedPrescriptionDoctor?id=${prescription._id}`}>View Prescription</Link>
                <Link to={`/addToPrescription?id=${prescription._id}`}>
                  <button>Add Medicine</button>
                </Link>
              </div>
            ))}
          </div>
        )}
        {message && <h3>{message}</h3>}
      </div>
    </div>
  );
};

export default DoctorAuthorization(ViewMyPrescriptions);
