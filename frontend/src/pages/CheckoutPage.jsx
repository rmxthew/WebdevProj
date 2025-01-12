import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './checkoutpage.css';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
          alert('You must be logged in to proceed to checkout.');
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:8800/users/${user.id}`);
        setName(response.data.full_name || '');
        setAddress(response.data.address || '');
        setPhoneNumber(response.data.phone_number || '');
      } catch (error) {
        console.error('Error fetching user info:', error);
        alert('Something went wrong. Please try again.');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handlePlaceOrder = async () => {
    if (!name || !address || !phoneNumber) {
      alert('Please fill in your shipping information.');
      return;
    }

    try {
      const userID = JSON.parse(localStorage.getItem('user'))?.id;
      const items = state.cart;
      const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

      const orderData = {
        userID,
        items,
        totalAmount,
        shippingAddress: address,
        fullName: name,
        phoneNumber,
        paymentMethod, 
      };

      const response = await axios.post('http://localhost:8800/orders', orderData);

      if (response.data.success) {
        alert('Order placed successfully! Redirecting to Orders.');

        await axios.delete(`http://localhost:8800/cart/clear/${userID}`);

        setTimeout(() => {
          navigate('/UserOrders');
        }, 3000);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>

      <div className="cart-summary">
        <h2>Cart Summary</h2>
        <ul>
          {state.cart.map((item, index) => (
            <li key={index} className="cart-item">
              <span>
                {item.prod_name} - ₱{item.price} x {item.quantity}
              </span>
            </li>
          ))}
        </ul>
        <div className="total">
          <span>Total: </span>
          <span>
            ₱{state.cart.reduce((total, item) => total + item.price * item.quantity, 0)}
          </span>
        </div>
      </div>

      <div className="shipping-info">
        <h2>Shipping Information</h2>
        <form>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="address">Shipping Address</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="input-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Gcash">GCash</option>
              <option value="Maya">Maya</option>
            </select>
          </div>
        </form>
      </div>

      <div className="buttons-container">
        <button className="back-butn" onClick={handleBackToCart}>
          Back to Cart
        </button>
        <button className="place-order-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
