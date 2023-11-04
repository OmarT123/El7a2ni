import {BrowserRouter, Routes, Route} from 'react-router-dom'

import NavBar from './components/NavBar'
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <div className='pages'>
          <Routes>

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
