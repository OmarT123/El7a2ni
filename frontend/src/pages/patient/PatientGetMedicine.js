import {useEffect, useState} from 'react';
import axios from 'axios';

//components
import MedicineDetails from '../../components/medicineDetails'
import PatientAuthorization from '../../components/PatientAuthorization';
import AddToCartForm from '../../components/AddToCartForm';

const PatientGetMedicine = ({ user }) => {
  const [medicines, setMedicines] = useState([]);
  const [message, setMessage] = useState('');
  const [searchBar, setSearchBar] = useState('')

  const fetchMedicines = async () => {
    try {
      const res = await axios.get('/getMedicines');
      const medicinesData = res.data;
      setMedicines(medicinesData);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleSearchName = async () => {
    try {
      const response = await axios.get('/searchMedicinePatient', { params: { name: searchBar } });
      const list = response.data;

      if (typeof list === 'string') {
        setMessage(list);
        setMedicines([]);
      } else {
        setMedicines(list);
        setMessage(null);
      }
    } catch (error) {
      setMessage('An error occurred while fetching data.');
      setMedicines([]);
    }
  };


  const handleSearchMedUse = async () => {
    try {
      const res = await axios.get('filterByMedicinalUsePatient', { params: { medicinalUse: searchBar } });
      const list = res.data;
      if (typeof list === 'string') {
        setMessage(list);
        setMedicines([]);
      } else {
        setMedicines(list);
        setMessage(null);
      }
    } catch (err) {
      console.log(err);
    }
  }
  const handleGetSubstitute = async (medicine) => {
    try {
      setMedicines([]);
      const { activeIngredient } = medicine;
      const response = await axios.get('/getSubMedicines', { params: { activeIngredient } });
      const substitutedMedicines = response.data.medicines;

      if (substitutedMedicines.length === 0) {
        setMessage('There is no substitute available for this medicine.');
      } else {
        setMedicines(substitutedMedicines);
        setMessage(''); // Clear the message if substitutes are available
      }
    } catch (error) {
      console.error('Error fetching substitute medicines:', error);
    }
  };

  return (
    <div className="home">
      <div className="Medicines">
      <div className="SearchMedicine" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={searchBar}
            onChange={(e) => setSearchBar(e.target.value)}
            style={{ width: '300px', textAlign: 'center' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px' }}>
          <button style={{ backgroundColor: 'yellow', color: 'black' }} onClick={handleSearchName}>
            Search By Name
          </button>
          <button style={{ backgroundColor: 'yellow', color: 'black' }} onClick={handleSearchMedUse}>
            Search By Medicinal Use
          </button>
        </div>
      </div>
        {medicines.map((medicine) => (
          <div key={medicine._id}>
            <MedicineDetails medicine={medicine} />
            {medicine.stockQuantity > 0 && (
              <AddToCartForm key={medicine._id} medicine={medicine} />
            )}
            {medicine.stockQuantity === 0 && (
              <div>
                <button onClick={() => handleGetSubstitute(medicine)}>
                  Get Substitute
                </button>
              </div>
            )}
          </div>
        ))}
        {medicines.length === 0 && (
          <div>
            <p>{message}</p>
            <button onClick={fetchMedicines}>Back</button>
          </div>
        )}
        <br />
        <a href="/cart">
          <button style={{ backgroundColor: 'green', color: 'white' }}>My cart</button>
        </a>
      </div>
    </div>
  );
};

export default PatientAuthorization(PatientGetMedicine)