import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

const LoginPage = () => {
  const [userIdentifier, setUserIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8800/login', {
        userIdentifier,
        password,
      });

      if (response.data.message === 'Login successful') {
        
        setMessage('Login successful!');
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('username', response.data.user.username);
        localStorage.setItem('role', response.data.user.role);
        setTimeout(() => {
          const role = response.data.user.role; 
          if (role === 'admin') {
            navigate('/shoes'); 
          } else {
            navigate('/LandingPage2'); 
          }
        }, 1000);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Log In</h1>
        {message && <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="userIdentifier">Username or Email</label>
            <input
              type="text"
              id="userIdentifier"
              value={userIdentifier}
              onChange={(e) => setUserIdentifier(e.target.value)}
              placeholder="Enter your username or email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" className="login-button">Log In</button>
            <Link to="/" className="cancel-button">Cancel</Link>
          </div>
        </form>
        <p className="signup-text">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;