import Navbar from './components/Navbar.jsx'
import './styles/App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './pages/Register.jsx';

function App() {

  return (
      <BrowserRouter>
          <Navbar />

          <Routes>
                <Route path="/register" element={<Register />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
