import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';  

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    phone_number: '',
    address: '',
    password: '',
    confirm_password: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({
      username: parsedUser.username || '',
      full_name: parsedUser.full_name || '',
      phone_number: parsedUser.phone_number || '',
      address: parsedUser.address || '',
      password: '',
      confirm_password: ''
    });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePasswords = () => {
    if (formData.password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return false;
    }
    
    if (!/[A-Z]/.test(formData.password)) {
      setMessage("Password must contain at least one uppercase letter.");
      return false;
    }
    
    if (!/[a-z]/.test(formData.password)) {
      setMessage("Password must contain at least one lowercase letter.");
      return false;
    }
    
    if (!/\d/.test(formData.password)) {
      setMessage("Password must contain at least one number.");
      return false;
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setMessage("Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>).");
      return false;
    }
    
    if (/\s/.test(formData.password)) {
      setMessage("Password cannot contain spaces.");
      return false;
    }
    
    if (formData.password !== formData.confirm_password) {
      setMessage("Passwords do not match.");
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmUpdate = window.confirm('Are you sure you want to update your profile information?');

    if (!confirmUpdate) {
    return;  
    }
    
    if (formData.password && !validatePasswords()) {
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8800/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          address: formData.address,
          ...(formData.password && { password: formData.password })
        })
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify({
          ...user,
          username: formData.username,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          address: formData.address
        }));
        setUser((prevUser) => ({
          ...prevUser,
          username: formData.username,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          address: formData.address
        }));
        setMessage(data.message || 'Profile updated successfully!');
      } else {
        setMessage(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('An unexpected error occurred.');
    }
  };
  
  

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
  
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8800/users/${user.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (response.ok) {
          localStorage.removeItem('user');
          localStorage.removeItem('username');
          alert('Account deleted successfully.');
          navigate('/');
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Failed to delete the account.');
        }
      } catch (error) {
        alert('An error occurred while deleting the account.');
      }
    }
  };
  

  const handleBack = () => {
    navigate('/LandingPage2');
  };

  if (!user) return null;

  return (
    <div className="editProfileContainer">
      <div className="editProfileWrapper">
        <div className="editProfileCard">
          <div className="editProfileHeader">
            <div className="editProfileHeaderContent">
              
              <h1 className="pageTitle">Profile Settings</h1>
              <button 
                onClick={handleBack}
                className="backButtonEditProfile"
              >
                Back to Home
              </button>
            </div>
          </div>

          <div className="contentContainer">
            {message && (
              <div className="messageAlert">
                {message}
              </div>
            )}

            <div className="profileGrid">
             
              <div className="viewSection">
                <h2 className="pageTitle">Current Information</h2>
                <div className="fieldGroup">
                  <label className="fieldLabel">Username:</label>
                  <p className="fieldValue">{user.username}</p>
                </div>
                <div className="fieldGroup">
                  <label className="fieldLabel">Full Name:</label>
                  <p className="fieldValue">{user.full_name}</p>
                </div>
                <div className="fieldGroup">
                  <label className="fieldLabel">Email:</label>
                  <p className="fieldValue">{user.email}</p>
                </div>
                
                <div className="fieldGroup">
                  <label className="fieldLabel">Phone Number:</label>
                  <p className="fieldValue">{user.phone_number}</p>
                </div>
                <div className="fieldGroup">
                  <label className="fieldLabel">Address:</label>
                  <p className="fieldValue">{user.address}</p>
                </div>
              </div>


<div className="editSection">
  <h2 className="pageTitle">Edit Profile</h2>
  <form onSubmit={handleSubmit}>
     
    <div className="fieldGroup">
      <label className="fieldLabel">Full Name:</label>
      <input
        type="text"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        className="inputField"
      />
    </div>
    <div className="fieldGroup">
      <label className="fieldLabel">Phone Number:</label>
      <input
        type="tel"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleChange}
        className="inputField"
      />
    </div>
    <div className="fieldGroup">
      <label className="fieldLabel">Address:</label>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        className="inputField"
      />
    </div>
    <div className="fieldGroup">
      <label className="fieldLabel">New Password:</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Leave blank to keep current password"
        className="inputField"
      />
    </div>
    <div className="fieldGroup">
      <label className="fieldLabel">Confirm New Password:</label>
      <input
        type="password"
        name="confirm_password"
        value={formData.confirm_password}
        onChange={handleChange}
        placeholder="Leave blank to keep current password"
        className="inputField"
      />
    </div>
    <button type="submit" className="primaryButton">
      Save Changes
    </button>
  </form>

  <div className="deleteSection">
    <button onClick={handleDeleteAccount} className="deleteButton">
      Delete Account
    </button>
  </div>
</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
