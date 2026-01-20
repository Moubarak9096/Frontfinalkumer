// Fichier: src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home/Home';
import CreateEvent from './pages/CreateEvent/CreateEvent'; 
import CompetitionsPage from "./pages/Competitions/CompetitionsPage";
import AdminDashboard from './pages/Admin/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdmin/SuperAdminDashboard';
import Login from './pages/Auth/Login'; 
import Register from './pages/Auth/Register'; 
import ForgotPassword from './pages/Auth/ForgotPassword';
import ChangePassword from './pages/Auth/ChangePassword';  
import UserProfile from './pages/User/UserProfile';
import AgencyDashboard from './pages/Agency/AgencyDashboard';
import RegisterOrganizer from './pages/Auth/RegisterOrganizer';
import About from './pages/about/about';
import Contact from './pages/contact/contact';
import Results from './pages/results/results';
import Conditions from './pages/conditions/conditions';
import Event from './components/EventCard/Event';
import './App.css';

function App() {
  return (
       <AuthProvider>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
             <Route path="/ForgotPassword" element={<ForgotPassword />} />
             <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/register" element={<Register />} />
       <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/create-event" element={<CreateEvent />} />
<Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/agency" element={<AgencyDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/superadmin/*" element={<SuperAdminDashboard />} />
          <Route path="/register-organizer" element={<RegisterOrganizer />} />
        <Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
<Route path="/results" element={<Results />} />
<Route path="/conditions" element={<Conditions />} />
        <Route path="/event/:competitionId" element={<Event />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;




