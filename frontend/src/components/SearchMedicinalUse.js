import axios from 'axios';
import { useState } from 'react';

import MedicineDetails from './medicineDetails';

const SearchMedicinalUse = ({ apiLink, show }) => {
  const [medicinalUse, setMedicinalUse] = useState('');
  const [medicine, setMedicine] = useState([]);

  const search = async (e) => {
    e.preventDefault();

    const body = { medicinalUse: medicinalUse };
    try {
      const res = await axios.get(apiLink, { params: body });
      setMedicine(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='search-container'>
      <form className='create'>
        <h3>Search for Medicine</h3>

        <label>Medicinal Use:</label>
        <input
          type='text'
          value={medicinalUse}
          onChange={(e) => setMedicinalUse(e.target.value)}
        />
        <button onClick={search}>Search</button>
      </form>
      <div className='search-results'>
      {medicine &&
  medicine.map((med, index) => (
    <MedicineDetails key={med.id || index} medicine={med} show={show} />
  ))}

      </div>
    </div>
  );
};

export default SearchMedicinalUse;
