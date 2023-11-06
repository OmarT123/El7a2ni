import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DisplayPrescription = ({ prescription }) => {
  const pageLink = "/SelectedPrescription?id=" + prescription._id;

  return (
    <Link to={pageLink}>
      <strong>Filled: {prescription.filled ? "filled" : "not filled"}</strong>
      {prescription.medicines ? (
        prescription.medicines.map((medicine) => (
          <div key={medicine._id} className="medicine-card">
            <div>
              <strong>Name: {medicine.medId.name}</strong>
            </div>
            <div>
              <strong>Price: {medicine.medId.price}</strong>
            </div>
            <div>
              <strong>Medicinal Use: {medicine.medId.medicinalUse}</strong>
            </div>
            <div>
              <strong>Dosage: {medicine.dosage}</strong>
            </div>
          </div>
        ))
      ) : (
        <div>Loading prescription data...</div>
      )}
    </Link>
  );
};

export default DisplayPrescription;
