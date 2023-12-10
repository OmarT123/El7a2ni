import axios from 'axios'
import { useState,useEffect } from 'react'
import PatientAuthorization from '../../components/PatientAuthorization'

const SelectedPrescription= ({user}) => {
    const [prescription, setPrescription] = useState(null)
    useEffect(() => {
        const getPrescription = async()=> {
        const queryParams = new URLSearchParams(window.location.search)
        const id = queryParams.get('id')
        await axios.get('/selectPrescription?id='+id).then(res => setPrescription(res.data)).catch(err=>console.log(err.message))
        }

        getPrescription()
    },[])

    return (
        <div>
        {prescription && prescription.medicines && prescription.medicines.map((medicine) => (
          <div key={medicine._id} className="medicine-card">
            <h4>{medicine.medId.name}</h4>
            <div className="medicine-info">
              <strong>Price: {medicine.medId.price}</strong>
              <strong>Medicinal Use: {medicine.medId.medicinalUse}</strong>
              <strong>Active Ingredient: {medicine.medId.activeIngredient}</strong>
              {medicine.medId.picture && (
                <img
                  src={medicine.medId.picture}
                  alt={medicine.medId.name}
                  className="medicine-image"
                />
              )}
              <strong>Dosage: {medicine.dosage}</strong>
            </div>
          </div>
        ))}
      </div>
      
    )
}

export default PatientAuthorization(SelectedPrescription) 