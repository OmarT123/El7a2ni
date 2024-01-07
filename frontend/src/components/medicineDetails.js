import React from 'react';

const MedicineDetails = ({ medicine}) => {


  return (
    <div
    className="medicine-details"
    style={{ backgroundColor: medicine.stockQuantity === 0 ? 'rgb(240, 50, 50)': 'inherit' }}
  >
      <h4>{medicine.name}</h4>
      <p><strong>Price: </strong>{medicine.price} Euro</p>
      <p><strong>Medicinal Use: </strong>{medicine.medicinalUse}</p>
      <p><strong>Active Ingredient: </strong>{medicine.activeIngredient}</p>
      <p><strong>Availability: </strong>{medicine.stockQuantity > 0 ? "Available" : "Out Of Stock"}</p>
      <br/>
      <img
        src={medicine.picture}
        alt="Medicine image"
        style={{ maxWidth: '200px', maxHeight: '300px', objectFit: 'contain' }}
      />

    </div>
  );
};

export default MedicineDetails;