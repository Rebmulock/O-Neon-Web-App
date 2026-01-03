import Navbar from './components/Navbar.jsx'
import './styles/App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import PublicRoute from "./components/PublicRoute.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Profile from './pages/Profile.jsx';
import Homepage from './pages/Homepage.jsx';

function App() {

  return (
      <BrowserRouter>
          <Navbar />

          <Routes>
              <Route path="/" element={<Homepage />} />

              <Route
                  path="/register"
                  element={
                      <PublicRoute>
                          <Register />
                      </PublicRoute>
                  }
              />

              <Route
                  path="/login"
                  element={
                      <PublicRoute>
                          <Login />
                      </PublicRoute>
                  }
              />

              <Route
                  path="/profile"
                  element={
                      <ProtectedRoute>
                          <Profile />
                      </ProtectedRoute>
                  }
              />

              <Route path="*" element={<div>Page not found</div>} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
