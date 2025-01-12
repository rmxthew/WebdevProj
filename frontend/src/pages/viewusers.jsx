import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './viewusers.css';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8800/users");

        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          console.error("API did not return an array of users");
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchAllUsers();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="view-users-container">

      <nav className="view-users-navbar">
        <h1>Users List</h1>
        <button className="view-users-back-button" onClick={handleBack}>
          Back
        </button>
      </nav>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="view-users-grid">
          {users.map((user) => (
            <div className="view-users-card" key={user.id}>
              <h2>{user.full_name}</h2>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone Number:</strong> {user.phone_number}</p>
              <p><strong>Address:</strong> {user.address}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
