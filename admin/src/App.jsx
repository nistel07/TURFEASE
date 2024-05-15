import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Landing from './pages/Landing'
import Login from './pages/Login'
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import SidePanel from './components/SidePanel';
import Grounds from './pages/Grounds';
import CreateGround from './pages/CreateGround';
import GroundDetails from './pages/GroundDetails';
import UpdateGround from './pages/UpdateGround';
import Bookings from './pages/Bookings';

function App() {

  return (
    <Provider store={store}>
      <Toaster />
      <Router>
        <div className='flex'>
          <SidePanel />
          <div className='flex-1 ml-64'>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" exact element={<Landing />} />
              <Route path="/grounds" element={<Grounds />} />
              <Route path="/create-ground" element={<CreateGround />} />
              <Route path="/ground/:id" element={<GroundDetails />} />
              <Route path="/update/:id" element={<UpdateGround />} />
              <Route path="/bookings" element={<Bookings />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  )
}

export default App
