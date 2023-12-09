import {BrowserRouter, Routes, Route} from 'react-router-dom'


import Home from './pages/Home'
import NavBar from './components/NavBar'
import UnapprovedDoctors from './pages/admin/unApprovedDoctors';
import HealthPackage from './pages/HealthPackage';
import HealthPackageInfo from './pages/HealthPackageInfo';
import FamilyMembers from './pages/patient/FamilyMembers'
import DoctoreditForm from './components/doctor/DoctoreditForm';
import ViewMyPrescriptions from './pages/ViewMyPrescriptions';
import SelectedPrescription from './pages/SelectedPrescription';
import MyPatients from './pages/doctor/MyPatients';
import SearchDoctor from './pages/patient/SearchDoctor'
import Prescription from './pages/patient/Prescription'
import RegisterPatient from './pages/patient/RegisterPatient'
import RegisterDoctor from './pages/doctor/RegisterDoctor'
import Patient from './pages/patient/Patient'
import Doctor from './pages/doctor/Doctor'
import AddAppointmentSlots from './pages/doctor/AddAppointmentSlots'
import FilterAppointmentsForDoctor from './pages/doctor/FilterAppointmentsForDoctor';
import FilterAppointmentsForPatient from './pages/patient/FilterAppointmentsForPatient';
import AddAdmin from './pages/admin/AddAdmin'
import FilterPatientsByAppointments from './pages/doctor/FilterPatientsByAppointments'
import DeletePatient from './pages/admin/DeletePatient';
import DeleteAdmin from './pages/admin/DeleteAdmin';
import DeleteDoctor from './pages/admin/DeleteDoctor';

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
            <Route path="/HealthPackage" element={<HealthPackage />} />
            <Route path="/HealthPackageInfo" element={<HealthPackageInfo />} />
            <Route path="/SearchDoctor" element={<SearchDoctor />} />
            <Route path="/registerPatient" element={<RegisterPatient />} />
            <Route path="/registerDoctor" element={<RegisterDoctor />} />
            <Route path="/patient" element={<Patient />} />
            <Route path="/doctor" element={<Doctor />} />
            <Route path="/deletePatient" element={<DeletePatient/>}/>
            <Route path="/deleteAdmin" element={<DeleteAdmin/>}/>
            <Route path="/deleteDoctor" element={<DeleteDoctor/>}/>
            <Route path="/Prescription" element={<Prescription/>}/>
            <Route path="/FilterPatientsByAppointments" element={<FilterPatientsByAppointments/>}/>
            <Route path='/SearchDoctor' element={<SearchDoctor/>}/>
            <Route path="/doctor" element={<Doctor/>}/>
            <Route path="/patient" element={<Patient/>}/>
            <Route path="/ViewMyPrescriptions" element={<ViewMyPrescriptions/>}/>
            <Route path="/SelectedPrescription" element={<SelectedPrescription/>}/>
            <Route path="/AddAppointmentSlot" element={<AddAppointmentSlots/>}/>

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
