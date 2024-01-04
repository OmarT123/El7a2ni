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
import RegisterDoctor from './pages/doctor/RegisterDoctor'
import Patient from './components/Patient'
import Doctor from './pages/patient/Doctor'
import AddAppointmentSlots from './pages/doctor/AddAppointmentSlots'
import FilterAppointmentsForDoctor from './pages/doctor/FilterAppointmentsForDoctor';
import FilterAppointmentsForPatient from './pages/patient/FilterAppointmentsForPatient';
import FilterPatientsByAppointments from './pages/doctor/FilterPatientsByAppointments'
import DeleteAdmin from './pages/admin/DeleteAdmin';
import DeleteDoctor from './pages/admin/DeleteDoctor';
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
import DoctorContract from './pages/doctor/DoctorContract';
import ViewPatientPrescriptions from './pages/doctor/ViewPatientPrescriptions';
import SelectedPrescriptionDoctor from './pages/doctor/SelectedPrescriptionDoctor';

// imported from the pharamcy : 
import UnApprovedPharmacists from './pages/admin/UnApprovedPharmacists'
import RegisterPatient from './pages/patient/RegisterPatient';
import RegisterPharmacist from './pages/pharmacist/RegisterPharmacist';
import EditMedicine from './pages/pharmacist/EditMedicine'
import SearchMedicineForAdmin from './pages/admin/SearchMedicineForAdmin'
import SearchMedicineForPatient from './pages/patient/SearchMedicineForPatient'
import SearchMedicineForPharmacist from './pages/pharmacist/SearchMedicinceForPharmacist'
import AddAdmin from './pages/admin/AddAdmin'
import DeletePatient from './pages/admin/DeletePatient'
import DeletePharmacist from './pages/admin/DeletePharmacist'
import PatientGetMedicine from './pages/patient/PatientGetMedicine'
import AdminGetMedicine from './pages/admin/AdminGetMedicine'
import PharmacistGetMedicine from './pages/pharmacist/PharmacistGetMedicine'
import GetAllPharmacists from './pages/admin/GetAllPharmacists'
import Pharmacist from './pages/admin/pharmacist'
import AddMedicine from './pages/pharmacist/AddMedicine';
import SearchMedicinalUsePharmacist from './pages/pharmacist/SearchMedicinalUsePharmacist';
import SearchMedicinalUsePatient from './pages/patient/SearchMedicinalUsePatient';
import SearchMedicinalUseAdmin from './pages/admin/SearchMedicinalUseAdmin';
import PharmacistApplication from './pages/admin/PharmacistApplication';
import MyCart from './pages/patient/MyCart' ;
import Checkout from './pages/patient/Checkout';
import PastOrders from './pages/patient/PastOrders';
import SuccessfulCheckout from './pages/patient/SuccessfulCheckout';

// user 

import Login from './pages/user/Login'
import ChangePassword from './pages/user/ChangePassword';
import ResetPassword from './pages/user/ResetPassword';
import ResetPasswordOTP from './pages/user/ResetPasswordOTP';
import NotAuthorized from './components/NotAuthorized';
import AddToPrescription from './pages/doctor/addToPrescription';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <div className='pages'>
          <Routes>
            {/*Pharmacy Routing */}
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/RegisterPatient" element={<RegisterPatient />}/>
            <Route path="/RegisterPharmacist" element={<RegisterPharmacist/>} />
            <Route  path="/UnApprovedPharmacists"  element={<UnApprovedPharmacists />}  />
            <Route path="/EditMedicine" element = {<EditMedicine/>} />
            <Route path="/SearchMedicineForPharmacist" element = {<SearchMedicineForPharmacist/>}/>
            <Route path="/SearchMedicineForAdmin" element = {<SearchMedicineForAdmin/>}/>
            <Route path="/SearchMedicineForPatient" element = {<SearchMedicineForPatient/>}/>
            <Route path="/AddAdmin" element = {<AddAdmin/>}/>
            <Route path="/cart" element = {<MyCart/>}/>
            <Route path="/DeletePatient" element = {<DeletePatient/>}/>
            <Route path="/DeletePharmacist" element = {<DeletePharmacist/>}/>
            <Route  path="/PatientGetMedicine" element={<PatientGetMedicine />}/>
            <Route path="/AdminGetMedicine" element={<AdminGetMedicine />}  />
            <Route  path="/PharmacistGetMedicine" element={<PharmacistGetMedicine />}/>
            <Route path="/GetAllPharmacists"  element={<GetAllPharmacists />} />
            <Route path="/pharmacist" element={<Pharmacist />}  />
            <Route path="/addMedicine" element={<AddMedicine />}/>
            <Route path="/searchMedicinalPharmacist" element={<SearchMedicinalUsePharmacist />} />
            <Route path="/searchMedicinalPatient" element={<SearchMedicinalUsePatient />} />
            <Route path="/searchMedicinalAdmin" element={<SearchMedicinalUseAdmin />} />
            <Route path="/PharmacistApplication" element={<PharmacistApplication />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/PastOrders" element={<PastOrders />} />
            <Route path="/SuccessfulCheckout" element={<SuccessfulCheckout />} />

            {/*Virtual clinic Routing */}
            <Route path="/Home" element={<Home />} />
            <Route path="/UnapprovedDoctors" element={<UnApprovedDoctors />} />
            <Route path='/FamilyMembers' element={<FamilyMembers/>}/>
            <Route path="/editDoctor" element={<DoctoreditForm/>}/>
            <Route path="/viewMyPatients" element={<MyPatients/>}/>
            <Route path='/FilterAppointmentsForPatient' element={<FilterAppointmentsForPatient/>}/>
            <Route path='/FilterAppointmentsForDoctor' element={<FilterAppointmentsForDoctor/>}/>
            <Route path="/HealthPackage" element={<HealthPackage />} />
            <Route path="/HealthPackageInfo" element={<HealthPackageInfo />} />
            <Route path="/ViewHealthPackages" element={<ViewHealthPackages />} />
            <Route path="/SearchDoctor" element={<SearchDoctor />} />
            <Route path="/registerDoctor" element={<RegisterDoctor />} />
            <Route path="/patient" element={<Patient />} />
            <Route path="/doctor" element={<Doctor />} />
            <Route path="/deleteAdmin" element={<DeleteAdmin/>}/>
            <Route path="/deleteDoctor" element={<DeleteDoctor/>}/>
            <Route path="/FilterPatientsByAppointments" element={<FilterPatientsByAppointments/>}/>
            <Route path="/doctor" element={<Doctor/>}/>
            <Route path="/patient" element={<Patient/>}/>
            <Route path="/ViewMyPrescriptions" element={<ViewMyPrescriptions/>}/>
            <Route path="/SelectedPrescription" element={<SelectedPrescription/>}/>
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
            <Route path='/ViewPatientPrescriptions' element={<ViewPatientPrescriptions/>}/>
            <Route path='/SelectedPrescriptionDoctor' element={<SelectedPrescriptionDoctor/>}/>
            <Route path='/addToPrescription' element={<AddToPrescription/>}/>


            {/*User Routing */}
            <Route path="/login" element ={<Login />}/>
            <Route path="/ChangePassword" element ={<ChangePassword />}/>
            <Route path="/ResetPassword" element ={<ResetPassword />}/>
            <Route path="/ResetPasswordOTP" element ={<ResetPasswordOTP />}/>

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
