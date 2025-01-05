import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./signup.css";

const SignUp = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const validatePasswords = () => {
    // Minimum length check
    if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return false;
    }
  
    // Check for uppercase letters
    if (!/[A-Z]/.test(formData.password)) {
      setPasswordError("Password must contain at least one uppercase letter.");
      return false;
    }
  
    // Check for lowercase letters
    if (!/[a-z]/.test(formData.password)) {
      setPasswordError("Password must contain at least one lowercase letter.");
      return false;
    }
  
    // Check for numbers
    if (!/\d/.test(formData.password)) {
      setPasswordError("Password must contain at least one number.");
      return false;
    }
  
    // Check for special characters
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setPasswordError("Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>).");
      return false;
    }
  
    // Check for spaces
    if (/\s/.test(formData.password)) {
      setPasswordError("Password cannot contain spaces.");
      return false;
    }
  
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return false;
    }
  
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setPasswordError("");

    // Validate passwords
    if (!validatePasswords()) {
      return;
    }

    if (!formData.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      const { confirmPassword, ...submitData } = formData;
      const response = await axios.post("http://localhost:8800/signup", submitData);
      console.log(response);
      
      // Show success message and redirect after a short delay
      setMessage("Account successfully created! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/login"); // Redirect to login page after 2 seconds
      }, 2000);
      
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred. Please try again.");
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="signup-page signup-signup-container">
  <h2>Sign Up</h2>
  {message && (
    <p
      className={
        message.includes("successfully")
          ? "signup-success-message"
          : "signup-error-message"
      }
    >
      {message}
    </p>
  )}
  {passwordError && <p className="signup-error-message">{passwordError}</p>}
  <form onSubmit={handleSubmit}>
    <div className="signup-form-row">
      <div className="signup-form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="signup-form-group">
        <label htmlFor="fullName">Full Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>
    </div>

    <div className="signup-form-row">
      <div className="signup-form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="signup-form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
    </div>

    <div className="signup-form-group">
      <label htmlFor="address">Address</label>
      <textarea
        id="address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
      />
    </div>

    <div className="signup-form-row">
      <div className="signup-form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <small className="signup-password-requirements">
          Password must be at least 8 characters long and contain:
          • One uppercase letter
          • One lowercase letter
          • One number
          • One special character
          • No spaces
        </small>
      </div>
      <div className="signup-form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
    </div>

    <div className="signup-button-container">
      <button type="submit">Sign Up</button>
      <button
        type="button"
        className="signup-back-button"
        onClick={handleBack}
      >
        Back
      </button>
    </div>
  </form>
</div>

  );
};

export default SignUp;