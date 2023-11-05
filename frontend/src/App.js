import {BrowserRouter, Routes, Route} from 'react-router-dom'

import NavBar from './components/NavBar'
import FamilyMembers from './pages/patient/FamilyMembers';
import Home from './pages/Home'
import SearchDoctor from './pages/patient/SearchDoctor';
import Doctor from './pages/doctor/Doctor';
import Prescription from './pages/patient/Prescription';
import RegisterPatient from './pages/patient/RegisterPatient';
import RegisterDoctor from './pages/doctor/RegisterDoctor';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <div className='pages'>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path='/FamilyMembers' element={<FamilyMembers/>}/>
            <Route path='/searchDoctor' element={<SearchDoctor/>}/>
            <Route path="/doctor" element={<Doctor/>}/>
            <Route path="/viewPrescriptions" element={<Prescription/>}/>
            <Route path="/register" element={<RegisterPatient />} />
            <Route path="/registerDoctor" element={<RegisterDoctor />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;