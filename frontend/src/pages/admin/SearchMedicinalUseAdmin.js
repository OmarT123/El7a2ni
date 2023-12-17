import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SearchMedicinalUse from '../../components/SearchMedicinalUse';
import AdminAuthorization from '../../components/AdminAuthorization';

const SearchMedicinalUseAdmin = ({ user }) => {


  return (
    <div>
       <SearchMedicinalUse apiLink="/filterByMedicinalUseAdmin" show={true} />
    </div>
  );
};

export default AdminAuthorization(SearchMedicinalUseAdmin);
