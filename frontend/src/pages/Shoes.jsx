import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Shoes.css';

const Shoes = () => {
  const [shoes, setShoes] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchAllShoes = async () => {
      try {
        const endpoint = showInactive ? "http://localhost:8800/shoes/all" : "http://localhost:8800/shoes";
        const res = await axios.get(endpoint);
        setShoes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllShoes();
  }, [showInactive]);

  const handleActivate = async (id) => {
    if (window.confirm("Are you sure you want to make this item active again?")) {
      try {
        const res = await axios.put(`http://localhost:8800/shoes/activate/${id}`);
        alert(res.data);
        setShoes(shoes.map((shoe) => (shoe.id === id ? { ...shoe, is_active: 1 } : shoe))); 
      } catch (err) {
        alert("Error: Unable to activate item.");
        console.error("Error activating item:", err.response ? err.response.data : err.message);
      }
    }
  };
  



  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to mark this item unlisted?")) {
      try {
        const res = await axios.delete(`http://localhost:8800/shoes/${id}`);
        alert(res.data); 
        setShoes(shoes.filter((shoe) => shoe.id !== id)); 
      } catch (err) {
        alert("Error: Unable to delete item.");
        console.error("Error deleting item:", err.response ? err.response.data : err.message);
      }
    }
  };

  
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('user');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      navigate('/');
    }
  };


  const handleViewPendingOrders = () => {
    navigate('/PendingOrders');
  };

 
  const handleViewUsers = () => {
    navigate('/viewusers');
  };

  return (
    <div>
     
      <div className="header">
        <h1>Admin Dashboard</h1>
        <div className="header-buttons">
          <button className="header-btn add-btn">
            <Link to="/add">Add Items</Link>
          </button>
          <button className="header-btn view-orders-btn" onClick={handleViewPendingOrders}>
            View Pending Orders
          </button>
          <button className="header-btn view-users-btn" onClick={handleViewUsers}>
            View Users
          </button>
          <button className="header-btn toggle-btn" onClick={() => setShowInactive(!showInactive)}>
            {showInactive ? "Show Active Items" : "Show Inactive Items"}
          </button>
          <button className="header-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>


      <div className="shoes">
        {shoes.map((shoe) => (
          <div className="shoe" key={shoe.id}>
            {shoe.image && <img src={`http://localhost:8800${shoe.image}`} alt={shoe.prod_name} />}
            <h2>{shoe.prod_name}</h2>
            <p>{shoe.prod_description}</p>
            <span>₱{shoe.price}</span>
            <div className="quantity-container">
              <span>Quantity in stock: {shoe.quantity}</span>
              <span>Status: {shoe.is_active === 1 ? "Active" : "Inactive"}</span>
            </div>
            <div className="button-container">
            {shoe.is_active === 1 ? (
                  <button className="delete" onClick={() => handleDelete(shoe.id)}>Mark Unlisted</button>
                ) : (
                  <button className="activate" onClick={() => handleActivate(shoe.id)}>Make Active</button>
                )}
              <button className="update">
                <Link to={`/update/${shoe.id}`}>Update</Link>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shoes;
