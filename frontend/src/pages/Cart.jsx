import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./cartpage.css";

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

 
  const userID = useMemo(() => {
    return location.state?.userID || JSON.parse(localStorage.getItem('user'))?.id;
  }, [location.state]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!userID) return;

      try {
        const response = await axios.get(`http://localhost:8800/cart/${userID}`);
        setCart(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [userID]);

 
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
        userID,
        productID: item.productID,
        quantity: newQuantity,
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
    const userID = location.state?.userID || JSON.parse(localStorage.getItem('user'))?.id;
  
    try {
      
      console.log("Removing item with userID:", userID, "and productID:", item.productID);
  
      
      const response = await axios.delete(`http://localhost:8800/cart/remove/${userID}/${item.productID}`);
  
      if (response.data.success) {
        
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
  
        alert("Item removed from cart successfully.");
      } else {
        alert(response.data.message || "Failed to remove item from cart.");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Could not remove item from cart.");
    }
  };
  

  const handleClearCart = async () => {
    try {
      const userID = location.state?.userID || JSON.parse(localStorage.getItem('user'))?.id;
  
      if (!userID) {
        alert("User not found.");
        return;
      }
  
      console.log("Clearing cart for userID:", userID);
  

      const response = await axios.delete(`http://localhost:8800/cart/clear/${userID}`);
  
      if (response.data.success) {
        setCart([]);
        alert("Cart cleared successfully.");
      } else {
        alert("Failed to clear the cart.");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("Could not remove item from cart.");
    }
  };
  
  
  
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkoutpage", { state: { cart } });
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h1 className="cart-title"> Shopping Cart</h1>
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
