import {useEffect, useState} from 'react';
import axios from 'axios';

//components
import MedicineDetails from '../../components/medicineDetails'
import PatientAuthorization from '../../components/PatientAuthorization';
import AddToCartForm from '../../components/AddToCartForm';

const PatientGetMedicine = ({user}) => {
  const [medicines, setMedicines] = useState(null)

  useEffect(() => 
  {
    const fetchMedicines = async() => {
    await axios.get('/searchMedicinePatient').then(
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
          <div >
          <MedicineDetails key={medicine._id} medicine = {medicine} />
          <AddToCartForm key={medicine._id} medicine = {medicine} />
          </div>

          ))
         } 
         <br></br>  
        <a href="/cart">
        <button style={{ backgroundColor: 'green', color: 'white' }}>My cart</button>
        </a>
        </div>
        </div>
  )
}

export default PatientAuthorization(PatientGetMedicine)

