// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleSignup from './pages/GoogleSignup'
import Home from './pages/Home'
import TrainerDashboard from './components/trainer/TrainerDashboard';
import TraineeDashboard from './components/trainee/TraineeDashboard';
import Register from './components/trainer/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<GoogleSignup/>}/>
        <Route path="/dashboard/trainer" element={<TrainerDashboard />} />
        <Route path="/dashboard/trainee" element={<TraineeDashboard />} />
        <Route path="/register/:token" element={<Register/>}/>
      </Routes>
    </Router>
  );
}

export default App;

