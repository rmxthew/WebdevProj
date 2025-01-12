import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PendingOrders.css';

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8800/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:8800/orders/update/${orderId}`, {
        status: newStatus,
      });
      alert('Order status updated successfully!');
      const response = await axios.get('http://localhost:8800/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status.');
    }
  };

  const handleBackToAdminDashboard = () => {
    navigate('/Shoes');
    window.scrollTo(0, 0);
  };

  return (
    <div className="pending-orders-container">
      <nav className="pending-orders-navbar">
        <h1>Pending Orders</h1>
        <button className="back-button-admin" onClick={handleBackToAdminDashboard}>
          Back to Admin Dashboard
        </button>
      </nav>

      {orders.length > 0 ? (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.orderID} className="order-card">
              <h2 className="order-id">Order ID: {order.orderID}</h2>
              <p><strong>Full Name:</strong> {order.full_name}</p>
              <p><strong>Phone Number:</strong> {order.phone_number}</p>
              <p><strong>Total Amount:</strong> ₱{order.totalAmount}</p>
              <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
              <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p> 

              <label htmlFor={`status-${order.orderID}`}><strong>Status:</strong></label>
              <select
                id={`status-${order.orderID}`}
                value={order.status}
                onChange={(e) => handleStatusChange(order.orderID, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Completed">Completed</option>
              </select>

              <h3 className="items-title">Items Ordered:</h3>
              <ul className="items-list">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.prod_name} - Quantity: {item.quantity} - Price: ₱{item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-orders-message">No orders found.</p>
      )}
    </div>
  );
};

export default PendingOrders;
