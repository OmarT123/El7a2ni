import {BrowserRouter, Routes, Route} from 'react-router-dom'

// pages & components
import Home from './pages/Home'
import NavBar from './components/NavBar'
import UnapprovedDoctors from './pages/unApprovedDoctors'
import FamilyMembers from './pages/FamilyMembers';
import SearchDoctor from './pages/SearchDoctor';
import Doctor from './pages/Doctor';
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
            <Route path='/searchDoctor' element={<SearchDoctor/>}/>
            <Route path="/doctor" element={<Doctor/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;