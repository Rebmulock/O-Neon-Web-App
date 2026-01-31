import Navbar from './components/Navbar.jsx'
import './styles/App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import PublicRoute from "./components/PublicRoute.jsx";
import { ProtectedRoute, InstructorRoute } from "./components/ProtectedRoutes.jsx";
import Profile from './pages/Profile.jsx';
import Homepage from './pages/Homepage.jsx';
import InstructorDashboard from "./pages/InstructorDashboard.jsx";
import InstructorOverview from "./pages/InstructorOverview.jsx";
import CourseEdit from "./pages/CourseEdit.jsx";
import Credit from "./pages/Credit.jsx";
import NotFound from "./pages/NotFound.jsx";


function App() {
    return (
        <BrowserRouter>
            <Navbar/>

            <Routes>
                <Route path="/" element={<Homepage/>}/>

                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register/>
                        </PublicRoute>
                    }
                />

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login/>
                        </PublicRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard/instructor"
                    element={
                        <InstructorRoute>
                            <InstructorDashboard/>
                        </InstructorRoute>
                    }
                >
                    <Route index path="overview" element={<InstructorOverview />} />
                    <Route path="create" element={<CourseEdit mode="create" />} />
                    <Route path="update/:id" element={<CourseEdit mode="edit" />} />
                    <Route path="credit" element={<Credit />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
