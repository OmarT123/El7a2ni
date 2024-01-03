import axios from 'axios';
import { useState, useEffect } from 'react';
import PatientAuthorization from '../../components/PatientAuthorization';
import html2pdf from 'html2pdf.js';

const SelectedPrescription = ({ user }) => {
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPrescription = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const id = queryParams.get('id');
      try {
        const response = await axios.get('/selectPrescription?id=' + id);
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
  
    // const title = document.createElement('h1');
    // title.innerText = 'Prescription'; // You can customize the title here
    // title.style.textAlign = 'centre';
  
    // content.insertBefore(title, content.firstChild);
    html2pdf().from(content).set(pdfOptions).save();
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
              <p><strong>Doctor: </strong>{prescription.doctor.name}</p>
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

export default PatientAuthorization(SelectedPrescription);