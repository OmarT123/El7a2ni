import {useEffect, useState} from 'react';
import axios from 'axios';

import PharmacistAuthorization from '../../components/PharmacistAuthorization';
import MedicineDetailsPharmacist from '../../components/medicineDetailsPharmacist'

const PharmacistGetMedicine = () => {
  const [medicines, setMedicines] = useState(null)

  useEffect(() => 
  {
    const fetchMedicines = async() => {
    await axios.get('/searchMedicinePharmacist').then(
            (res) => { 
                const medicines = res.data
                setMedicines(medicines)
            }
             );
          }
          fetchMedicines();
  },[])

  return (
    <div className="home">
      <div className="Medicines">
        {medicines && medicines.map((medicine) => (
          <MedicineDetailsPharmacist key={medicine._id} medicine = {medicine} />
        ))}
      </div>
    </div>
  )
}

export default PharmacistAuthorization(PharmacistGetMedicine) ;
