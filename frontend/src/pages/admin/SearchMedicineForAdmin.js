import React, { useState, useEffect } from 'react';
import SearchMedicine from '../../components/SearchMedicine';
import AdminAuthorization from '../../components/AdminAuthorization';

const SearchMedicineForAdmin = ({ user })=> {

  

  return (
    <div className="Medicine-container">
        <div className="SearchMedicineAdmin">
          <SearchMedicine apiLink="/searchMedicineAdmin" />
        </div>
    </div>
  );
};

export default AdminAuthorization(SearchMedicineForAdmin);
