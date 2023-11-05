import {BrowserRouter, Routes, Route} from 'react-router-dom'

import NavBar from './components/NavBar'
import FamilyMembers from './pages/FamilyMembers';
import Home from './pages/Home'
import FilterAppointments from './components/FilterAppointments';
import FilterAppointmentsForDoctor from './pages/FilterAppointmentsForDoctor';
import FilterAppointmentsForPatient from './pages/FilterAppointmentsForPatient';
import AddAdmin from './pages/AddAdmin';
import DeletePatient from './pages/DeletePatient';
import DeleteAdmin from './pages/DeleteAdmin';
import DeleteDoctor from './pages/DeleteDoctor';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <div className='pages'>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path='/FamilyMembers' element={<FamilyMembers/>}/>
            <Route path='/FilterAppointmentsForPatient' element={<FilterAppointmentsForPatient/>}/>
            <Route path='/FilterAppointmentsForDoctor' element={<FilterAppointmentsForDoctor/>}/>
            <Route path='/AddAdmin' element={<AddAdmin/>}/>
            <Route path='/DeletePatient' element={<DeletePatient/>}/>
            <Route path='/DeleteAdmin' element={<DeleteAdmin/>}/>
            <Route path='/DeleteDoctor' element={<DeleteDoctor/>}/>



            
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;