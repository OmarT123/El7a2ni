import axios from 'axios';
import { useState, useEffect } from 'react';
import DoctorAuthorization from '../../components/DoctorAuthorization';
import html2pdf from 'html2pdf.js';

const SelectedPrescription = ({ user }) => {
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dosages, setDosages] = useState({});

  useEffect(() => {
    const getPrescription = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const id = queryParams.get('id');
      try {
        const response = await axios.get('/selectPrescriptionDoctor?id=' + id);
        setPrescription(response.data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    getPrescription();
  }, []);

  const downloadPrescription = async () => {
    const content = document.getElementById('prescription-content');

    const pdfOptions = {
      margin: 10,
      filename: 'Prescription.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().from(content).set(pdfOptions).save();
  };

  const handleDosageUpdate = async (medicineId) => {
    const newDosage = {
      dosage: dosages[medicineId] || '', // Retrieve dosage from dosages object
      medicineId,
      prescriptionId: prescription._id,
    };

    const response = await axios.put('/addDosage', newDosage);
    window.location.reload();
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div id="prescription-content">
            {prescription && prescription.doctor && (
              <>
                <h1 style={{ textAlign: 'center' }}>Prescription</h1>
                <p><strong>Patient: </strong>{prescription.patient.name}</p>
                <p><strong>Prescription Date: </strong>{prescription.createdAt.substr(0, 10)}</p>
              </>
            )}
            {prescription && prescription.medicines && prescription.medicines.length > 0 ? (
              prescription.medicines.map((medicine) => (
                <div key={medicine._id} className="medicine-card">
                  <h4>{medicine.medId.name}</h4>
                  <div className="medicine-info">
                    <strong>Price: </strong>{medicine.medId.price}$
                    <strong>Medicinal Use: </strong>{medicine.medId.medicinalUse}
                    <strong>Active Ingredient: </strong>{medicine.medId.activeIngredient}
                    {medicine.medId.picture && (
                      <img
                        src={medicine.medId.picture}
                        alt={medicine.medId.name}
                        className="medicine-image"
                      />
                    )}
                    <strong>Dosage: </strong>{medicine.dosage}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="New Dosage"
                      value={dosages[medicine._id] || ''}
                      onChange={(e) => setDosages({ ...dosages, [medicine._id]: e.target.value })}
                    />
                    <button onClick={() => handleDosageUpdate(medicine._id)}>Update Dosage</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No medicine found in the prescription.</p>
            )}
          </div>
          <br />
          <button onClick={downloadPrescription}>Download Prescription</button>
        </>
      )}
    </div>
  );
};

export default DoctorAuthorization(SelectedPrescription);
