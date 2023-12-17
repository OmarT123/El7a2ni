import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MedicineDetails from '../../components/medicineDetails';
import AdminAuthorization from '../../components/AdminAuthorization';

const AdminGetMedicine = ({user}) => {
  const [medicines, setMedicines] = useState(null);

  useEffect(() => {
    fetchMedicines(); // Fetch medicines only if the user is authorized
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get('/searchMedicineAdmin');
      const medicines = response.data;
      setMedicines(medicines);
    } catch (error) {
      console.error('Fetch medicines error:', error);
    }
  };

  return (
    <div className="home">
      <div className="Medicines">
        {medicines &&
          medicines.map((medicine) => <MedicineDetails key={medicine._id} medicine={medicine} />)}
      </div>
    </div>
  );
};

export default AdminAuthorization(AdminGetMedicine);
