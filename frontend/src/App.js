import {BrowserRouter, Routes, Route} from 'react-router-dom'


import Home from './pages/Home'
import NavBar from './components/NavBar'
import UnApprovedDoctors from './pages/admin/unApprovedDoctors';
import HealthPackage from './pages/admin/HealthPackage';
import ViewHealthPackages from './pages/patient/ViewHealthPackages';
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
import AddAppointmentSlots from './pages/doctor/AddAppointmentSlots'
import FilterAppointmentsForDoctor from './pages/doctor/FilterAppointmentsForDoctor';
import FilterAppointmentsForPatient from './pages/patient/FilterAppointmentsForPatient';
import AddAdmin from './pages/admin/AddAdmin'
import FilterPatientsByAppointments from './pages/doctor/FilterPatientsByAppointments'
import DeletePatient from './pages/admin/DeletePatient';
import DeleteAdmin from './pages/admin/DeleteAdmin';
import DeleteDoctor from './pages/admin/DeleteDoctor';
import DoctorsAppointments from './components/doctor/DoctorsAppointments';
import PatientAppointments from './components/patient/PatientAppointments';
import LinkFamilyMember from "./components/patient/LinkFamilyMember";
import SuccessfulCheckoutHealthPackage from './pages/patient/SuccesfulCheckoutHealthPackage';
import CheckoutHealthPackage from './pages/patient/CheckoutHealthPackage';
import ViewFreeAppointments from './pages/patient/ViewFreeAppointments';
import SuccessfulCheckoutAppointment from './pages/patient/SuccessfulCheckoutAppointment';
import CheckoutAppointment from './pages/patient/CheckoutAppointment';
import UploadHealthRecords from './pages/UploadHealthRecords';
import ViewSubscribedHealthPackageAndCancel from './pages/patient/ViewSubscribedHealthPackageAndCancel';
import ViewMyWallet from './pages/patient/ViewMyWallet';
import ViewDoctorWallet from './pages/doctor/ViewDoctorWallet';
import DoctorApplication from './pages/admin/DoctorApplication';
import Login from './pages/user/Login'
import ChangePassword from './pages/user/ChangePassword';
import ResetPassword from './pages/user/ResetPassword';
import ResetPasswordOTP from './pages/user/ResetPasswordOTP';
import DoctorContract from './pages/doctor/DoctorContract';

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
            <Route path="/UnapprovedDoctors" element={<UnApprovedDoctors />} />
            <Route path='/FamilyMembers' element={<FamilyMembers/>}/>
            <Route path="/editDoctor" element={<DoctoreditForm/>}/>
            <Route path="/viewMyPatients" element={<MyPatients/>}/>
            <Route path='/FilterAppointmentsForPatient' element={<FilterAppointmentsForPatient/>}/>
            <Route path='/FilterAppointmentsForDoctor' element={<FilterAppointmentsForDoctor/>}/>
            <Route path='/AddAdmin' element={<AddAdmin/>}/>
            <Route path="/HealthPackage" element={<HealthPackage />} />
            <Route path="/HealthPackageInfo" element={<HealthPackageInfo />} />
            <Route path="/ViewHealthPackages" element={<ViewHealthPackages />} />
            <Route path="/SearchDoctor" element={<SearchDoctor />} />
            <Route path="/registerPatient" element={<RegisterPatient />} />
            <Route path="/registerDoctor" element={<RegisterDoctor />} />
            <Route path="/patient" element={<Patient />} />
            <Route path="/doctor" element={<Doctor />} />
            <Route path="/deletePatient" element={<DeletePatient/>}/>
            <Route path="/deleteAdmin" element={<DeleteAdmin/>}/>
            <Route path="/deleteDoctor" element={<DeleteDoctor/>}/>
            <Route path="/FilterPatientsByAppointments" element={<FilterPatientsByAppointments/>}/>
            <Route path="/doctor" element={<Doctor/>}/>
            <Route path="/patient" element={<Patient/>}/>
            <Route path="/ViewMyPrescriptions" element={<ViewMyPrescriptions/>}/>
            <Route path="/SelectedPrescription" element={<SelectedPrescription/>}/>
            <Route path="/viewDoctorAppointments" element={<DoctorsAppointments/>}/>
            <Route path="/viewPatientAppointments" element={<PatientAppointments />} />
            <Route path="/linkFamilyMemberAccount" element={<LinkFamilyMember />} />
            <Route path="/CheckoutHealthPackage" element={<CheckoutHealthPackage />} />
            <Route path="/SuccessfulCheckoutHealthPackage" element={<SuccessfulCheckoutHealthPackage />} />
            <Route path="/ViewFreeAppointments" element={<ViewFreeAppointments />} />
            <Route path="/CheckoutAppointment" element={<CheckoutAppointment />} />
            <Route path="/SuccessfulCheckoutAppointment" element={<SuccessfulCheckoutAppointment />} />
            <Route path="/AddAppointmentSlot" element={<AddAppointmentSlots/>}/>
            <Route path='/uploadHealthRecords' element={<UploadHealthRecords/>}/>
            <Route path="/ViewSubscribedHealthPackageAndCancel" element={<ViewSubscribedHealthPackageAndCancel/>}/>
            <Route path="/ViewMyWallet" element={<ViewMyWallet/>}/>
            <Route path="/ViewDoctorWallet" element={<ViewDoctorWallet/>}/>
            <Route path="/DoctorApplication" element={<DoctorApplication/>}/>
            <Route path="/doctorContract" element={<DoctorContract />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
