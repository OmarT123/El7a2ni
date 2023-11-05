import {BrowserRouter, Routes, Route} from 'react-router-dom'

import NavBar from './components/NavBar'
import FamilyMembers from './pages/FamilyMembers';
import Home from './pages/Home'
import DoctoreditForm from './components/DoctoreditForm';
import MyPatients from "./pages/MyPatients"
import SearchDoctor from './pages/SearchDoctor';
import Doctor from './pages/Doctor';
import Patient from './pages/Patient'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <div className='pages'>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path='/FamilyMembers' element={<FamilyMembers/>}/>
            <Route path="/editDoctor" element={<DoctoreditForm/>}/>
            <Route path="/viewmypatients" element={<MyPatients/>}/>
            <Route path='/searchDoctor' element={<SearchDoctor/>}/>
            <Route path="/doctor" element={<Doctor/>}/>
            <Route path="/patient" element={<Patient/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;