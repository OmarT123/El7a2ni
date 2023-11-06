import {BrowserRouter, Routes, Route} from 'react-router-dom'

// pages & components
import Home from './pages/Home'
import NavBar from './components/NavBar'
import UnapprovedDoctors from './pages/unApprovedDoctors'
import FamilyMembers from './pages/patient/FamilyMembers';
import DoctoreditForm from './components/DoctoreditForm';
import MyPatients from "./pages/MyPatients"
import SearchDoctor from './pages/patient/SearchDoctor';
import Doctor from './pages/doctor/Doctor';
import Prescription from './pages/patient/Prescription';
import RegisterPatient from './pages/patient/RegisterPatient';
import RegisterDoctor from './pages/doctor/RegisterDoctor';
import Patient from './pages/Patient'
import FilterAppointmentsForDoctor from './pages/FilterAppointmentsForDoctor';
import FilterAppointmentsForPatient from './pages/FilterAppointmentsForPatient';
import AddAdmin from './pages/AddAdmin';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <div className='pages'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/viewDocInfo" element={<UnapprovedDoctors />} />
            <Route path='/FamilyMembers' element={<FamilyMembers/>}/>
            <Route path="/editDoctor" element={<DoctoreditForm/>}/>
            <Route path="/viewmypatients" element={<MyPatients/>}/>
            <Route path='/FilterAppointmentsForPatient' element={<FilterAppointmentsForPatient/>}/>
            <Route path='/FilterAppointmentsForDoctor' element={<FilterAppointmentsForDoctor/>}/>
            <Route path='/AddAdmin' element={<AddAdmin/>}/>
            <Route path='/searchDoctor' element={<SearchDoctor/>}/>
            <Route path="/doctor" element={<Doctor/>}/>
            <Route path="/patient" element={<Patient/>}/>
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
