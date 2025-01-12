import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserOrders.css';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/orders/${user.id}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

 
  const handleBackToHome = () => {
    navigate('/LandingPage2');
    window.scrollTo(0, 0); 
  };



  return (
    <div className="orders-page-container">
  
      <div className="top-navigation-buttons">
        
        <button className="back-to-home-btn" onClick={handleBackToHome}>
          Go to Homepage
        </button>
      </div>

      <h1 className="orders-page-title">My Orders</h1>

      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.orderID} className="order-card-container">
            <h2 className="order-card-id">Order ID: {order.orderID}</h2>
            <p className="order-card-status">Status: {order.status}</p>
            <p className="order-card-total">Total Amount: ₱{order.totalAmount}</p>
            <p className="order-card-payment">Payment Method: {order.paymentMethod}</p> 
            <h3 className="order-card-items-title">Items:</h3>
            <ul className="order-card-items-list">
              {order.items.map((item, index) => (
                <li key={index} className="order-card-item">
                  {item.prod_name} - Quantity: {item.quantity} - Price: ₱{item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="no-orders-message">No orders found.</p>
      )}
    </div>
  );
};

export default UserOrders;
