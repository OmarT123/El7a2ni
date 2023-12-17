import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SearchMedicine = ({ apiLink }) => {
  const [name, setName] = useState('');
  const [medicineList, setMedicineList] = useState([]);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const FilterData = {};
    if (name !== '') FilterData['name'] = name;

    try {
      const response = await axios.get(apiLink, { params: FilterData });
      const list = response.data;

      if (typeof list === 'string') {
        setMessage(list);
        setMedicineList([]); 
      } else {
        setMedicineList(list);
        setMessage(null); 
      }
    } catch (error) {
      setMessage("An error occurred while fetching data.");
      setMedicineList([]); 
    }
  };

  return (
    <form className="SearchMedicine">
      <h3>Search Medicine</h3>

      <label>Name :</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={handleSubmit}>Search for this Medicine</button>

      {medicineList.length > 0 && (
        <ul>
          {medicineList.map((medicine) => (
            <li key={medicine._id}>
              <div>Name: {medicine.name}</div>
              <div>Price: {medicine.price}</div>
              <div>Stock Quantity: {medicine.stockQuantity}</div>
              <div>Amount Sold: {medicine.amountSold}</div>
              <div>Medicinal Use: {medicine.medicinalUse}</div>
              <div>Active Ingredient: {medicine.activeIngredient}</div>
              <div>Archived: {medicine.archived}</div>
              <div>Active Ingredient: {medicine.picture}</div>
            </li>
          ))}
        </ul>
      )}

      {message && <h3>{message}</h3>}
    </form>
  );
};

export default SearchMedicine;
