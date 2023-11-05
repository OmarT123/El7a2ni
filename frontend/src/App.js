import {BrowserRouter, Routes, Route} from 'react-router-dom'

import NavBar from './components/NavBar'
import FamilyMembers from './pages/FamilyMembers';
import Home from './pages/Home'
import FilterAppointments from './components/FilterAppointments';
import FilterAppointmentsForDoctor from './pages/FilterAppointmentsForDoctor';
import FilterAppointmentsForPatient from './pages/FilterAppointmentsForPatient';

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
            
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;