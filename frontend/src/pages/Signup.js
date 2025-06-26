import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import GoogleSignup from './GoogleSignup';
import '../styles/Signup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Trainee'
  });
 const navigate=useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', formData);
      toast.success(response.data.message, { autoClose: 3000 });
      setTimeout(() => navigate('/login'), 3000)
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Signup failed';
      toast.error(errorMsg, { autoClose: 3000 });
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit}>
        <h2>Signup</h2>
        <label htmlFor='name'>Name:</label>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <label htmlFor='email'>Email:</label>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <label htmlFor='password'>Password:</label>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <label htmlFor='role'>Role:</label>
        <select name="role" onChange={handleChange} value={formData.role} required>
          <option value="Trainer">Trainer</option>
          <option value="Trainee">Trainee</option>
        </select>
        <button type="submit">Signup</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Signup;
