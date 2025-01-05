import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './checkoutpage.css';

const Checkout = () => {
  const { state } = useLocation(); // Get the cart items passed from previous page
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const navigate = useNavigate();

  // Update quantity in database
  const updateProductQuantity = async (productId) => {
    try {
      const response = await axios.put(`http://localhost:8800/update-quantity/${productId}`);
      console.log(response.data); // Product quantity updated successfully
    } catch (error) {
      console.error('Error updating product quantity:', error);
    }
  };

  const handlePlaceOrder = async () => {
    // Update quantity for each product in the cart
    for (let item of state.cart) {
      await updateProductQuantity(item.id); // Call the function to update the quantity in the database
    }

    alert('Order placed successfully!');
    navigate('/order-confirmation'); // Navigate to an order confirmation page
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>

      <div className="cart-summary">
        <h2>Cart Summary</h2>
        <ul>
          {state.cart.map((item, index) => (
            <li key={index} className="cart-item">
              <span>{item.prod_name} - ${item.price}</span>
            </li>
          ))}
        </ul>
        <div className="total">
          <span>Total: </span>
          <span>${state.cart.reduce((total, item) => total + item.price, 0)}</span>
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
            <label>Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="credit-card">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
        </form>
      </div>

      <button className="place-order-btn" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
