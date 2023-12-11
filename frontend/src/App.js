import {BrowserRouter, Routes, Route} from 'react-router-dom'


import Home from './pages/Home'
import NavBar from './components/NavBar'
import UnApprovedDoctors from './pages/admin/UnApprovedDoctors';
import HealthPackage from './pages/admin/HealthPackage';
import HealthPackageInfo from './pages/admin/HealthPackageInfo';
import FamilyMembers from './pages/patient/FamilyMembers'
import DoctoreditForm from './components/doctor/DoctoreditForm';
import ViewMyPrescriptions from './pages/patient/ViewMyPrescriptions';
import SelectedPrescription from './pages/patient/SelectedPrescription';
import MyPatients from './pages/doctor/MyPatients';
import SearchDoctor from './pages/patient/SearchDoctor'
import RegisterPatient from './pages/patient/RegisterPatient'
import RegisterDoctor from './pages/doctor/RegisterDoctor'
import Patient from './components/Patient'
import Doctor from './pages/patient/Doctor'
import FilterAppointmentsForDoctor from './pages/doctor/FilterAppointmentsForDoctor';
import FilterAppointmentsForPatient from './pages/patient/FilterAppointmentsForPatient';
import AddAdmin from './pages/admin/AddAdmin'
import FilterPatientsByAppointments from './pages/doctor/FilterPatientsByAppointments'
import DeletePatient from './pages/admin/DeletePatient';
import DeleteAdmin from './pages/admin/DeleteAdmin';
import DeleteDoctor from './pages/admin/DeleteDoctor';
import Login from './pages/user/Login'
import ChangePassword from './pages/user/ChangePassword';
import ResetPassword from './pages/user/ResetPassword';
import ResetPasswordOTP from './pages/user/ResetPasswordOTP';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <div className='pages'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />

            <Route path="/Login" element ={<Login />}/>
            <Route path="/ChangePassword" element ={<ChangePassword />}/>

            <Route path="/ResetPassword" element ={<ResetPassword />}/>
            <Route path="/ResetPasswordOTP" element ={<ResetPasswordOTP />}/>
            {/* <Route path="/NotAuthorized" element ={<NotAuthorized />}/> */}
            <Route path="/UnapprovedDoctors" element={<UnApprovedDoctors />} />
            <Route path='/FamilyMembers' element={<FamilyMembers/>}/>
            <Route path="/editDoctor" element={<DoctoreditForm/>}/>
            <Route path="/viewMyPatients" element={<MyPatients/>}/>
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
            <Route path="/FilterPatientsByAppointments" element={<FilterPatientsByAppointments/>}/>
            <Route path='/SearchDoctor' element={<SearchDoctor/>}/>
            <Route path="/doctor" element={<Doctor/>}/>
            <Route path="/patient" element={<Patient/>}/>
            <Route path="/ViewMyPrescriptions" element={<ViewMyPrescriptions/>}/>
            <Route path="/SelectedPrescription" element={<SelectedPrescription/>}/>


          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
