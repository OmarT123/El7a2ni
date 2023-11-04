import {BrowserRouter, Routes, Route} from 'react-router-dom'

import NavBar from './components/NavBar'
import FamilyMembers from './pages/FamilyMembers';
import Home from './pages/Home'
import SearchDoctor from './pages/SearchDoctor';
import Doctor from './pages/Doctor';
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
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;