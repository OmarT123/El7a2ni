// MedicineSelection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorAuthorization from '../../components/DoctorAuthorization';

const MedicineSelection = () => {
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [selectedDosage, setSelectedDosage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    // Fetch the list of all medicines from the backend
    const fetchMedicines = async () => {
      try {
        const response = await axios.get('/viewAllMedicines');
        setMedicines(response.data);
      } catch (error) {
        console.error('Error fetching medicines:', error.message);
      }
    };

    fetchMedicines();
  }, []); // Fetch medicines once when the component mounts

  const handleMedicineSelect = (event) => {
    const selectedMedicineId = event.target.value;
    setSelectedMedicine(selectedMedicineId);
  };

  const handleDosageSelect = (event) => {
    const selectedDosage = event.target.value;
    setSelectedDosage(selectedDosage);
  };

  const handleAddMedicine = async () => {
    if (selectedMedicine && selectedDosage) {
      try {
        // Call the addToPrescription method
        const response = await axios.post('/addToPrescription', {
          prescriptionId: id,
          medId: selectedMedicine,
          dosage: selectedDosage,
        });

        setSuccessMessage(response.data.message); // Set the success message
        window.location.href = '/ViewPatientPrescriptions';
      } catch (error) {
        console.error('Error adding medicine to prescription:', error.message);
      }
    } else {
      alert('Please select both medicine and dosage.');
    }
  };

  return (
    <div>
      <label>Select Medicine:</label>
      <select value={selectedMedicine} onChange={handleMedicineSelect}>
        <option value="">Select an option</option>
        {medicines.map((medicine) => (
          <option key={medicine._id} value={medicine._id}>
            {medicine.name}
          </option>
        ))}
      </select>

      <label>Select Dosage:</label>
      <select value={selectedDosage} onChange={handleDosageSelect}>
        <option value="">Select a dosage</option>
        <option value="5">5</option>
        <option value="10">10</option>
        {/* Add other dosage options as needed */}
      </select>

      <button onClick={handleAddMedicine}>Add Medicine</button>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};
export default DoctorAuthorization(MedicineSelection);