import {BrowserRouter, Routes, Route} from 'react-router-dom'

// pages & components
import Home from './pages/Home'
import Navbar from './components/NavBar'
import UnapprovedDoctors from './pages/unApprovedDoctors'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className='pages'>
          <Routes> {/*Add all the routes to all the functionalities/pages here.*/}
          <Route 
              path="/" 
              element={<Home />} 
            />
            <Route 
              path="/viewDocInfo" 
              element={<UnapprovedDoctors />} 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
