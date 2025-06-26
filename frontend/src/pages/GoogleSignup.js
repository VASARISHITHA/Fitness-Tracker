import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import '../styles/GoogleSignup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const GoogleSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google-login', {
        tokenId: credentialResponse.credential,
      });
      toast.success('Google login successful');
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('trainerId', res.data.user._id);
      localStorage.setItem('userId',res.data.user._id);
      redirectUser(res.data.user.role);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      toast.success('Login successful');
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('trainerId', res.data.user._id);
      localStorage.setItem('userId', res.data.user._id);
      redirectUser(res.data.user.role);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Email login failed';
      toast.error(errorMsg);
    }
  };

  const redirectUser = (role) => {
    const normalizedRole = role.toLowerCase();
    if (normalizedRole === 'trainer') {
      window.location.href = '/dashboard/trainer';
    } else if (normalizedRole === 'trainee') {
      window.location.href = '/dashboard/trainee';
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="google-signup-container">
      <div className="email-login-container">
        <h1>Login</h1>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleEmailLogin}>Login</button>
        <h4>or</h4>
        <div className='google-login-button'>
        <GoogleLogin
          onSuccess={handleLogin}
          onError={() => console.error('Google Login Failed')}
        /></div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default GoogleSignup;
