import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./cartpage.css";

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    setCart(storedCart ? JSON.parse(storedCart) : []);
  }, []); // Only fetch cart from localStorage when component mounts
  

  const handleQuantityChange = async (index, newQuantity) => {
    if (newQuantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    const item = cart[index];

    try {
      const response = await axios.get(`http://localhost:8800/shoes/${item.productID}`);
      const availableQuantity = response.data.quantity;

      if (newQuantity > availableQuantity) {
        alert(`Only ${availableQuantity} units available for ${item.prod_name}.`);
        return;
      }

      await axios.put("http://localhost:8800/cart/update", {
        userID: location.state.userID,
        productID: item.productID,
        quantity: newQuantity
      });

      const updatedCart = cart.map((cartItem, i) =>
        i === index ? { ...cartItem, quantity: newQuantity } : cartItem
      );
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Could not update quantity.");
    }
  };

  const handleRemoveItem = async (index) => {
    const item = cart[index];

    try {
      await axios.delete("http://localhost:8800/cart/remove", {
        data: { userID: location.state.userID, productID: item.productID }
      });

      const updatedCart = cart.filter((_, i) => i !== index);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Could not remove item from cart.");
    }
  };

  const handleClearCart = () => {
    setCart([]);
    // Optionally, you can clear the cart from the database here.
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout", { state: { cart } });
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>
      {cart.length > 0 ? (
        <div>
          <ul className="cart-items-list">
            {cart.map((item, index) => (
              <li className="cart-item" key={index}>
                <div className="cart-item-info">
                  <img
                    className="cart-item-img"
                    src={`http://localhost:8800${item.image}`}
                    alt={item.prod_name}
                  />
                  <div>
                    <h3 className="cart-item-name">{item.prod_name}</h3>
                    <p className="cart-item-price">₱{item.price}</p>
                  </div>
                </div>
                <div className="cart-item-controls">
                  <input
                    type="number"
                    className="quantity-input"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, parseInt(e.target.value, 10))
                    }
                  />
                  <button
                    className="remove-item-btn"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <h2>Total: ₱{totalPrice.toFixed(2)}</h2>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <button className="clear-cart-btn" onClick={handleClearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      ) : (
        <p className="empty-cart-message">Your cart is empty.</p>
      )}
      <button className="back-btn" onClick={() => navigate("/products")}>
        Back to Products
      </button>
    </div>
  );
};

export default Cart;
