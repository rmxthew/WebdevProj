import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Products.css";

const Product = () => {
  const [shoes, setShoes] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();

  // Fetch shoes data from the backend
  useEffect(() => {
    const fetchAllShoes = async () => {
      try {
        const res = await axios.get("http://localhost:8800/shoes");
        setShoes(res.data);
      } catch (err) {
        console.error("Error fetching shoes:", err);
      }
    };
    fetchAllShoes();
  }, []);

  // Check user login status
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser); // Set the user if parsing succeeds
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        setUser(null); // Reset if parsing fails
      }
    } else {
      setUser(null); // Reset if no user found
    }
  }, []);

  const isUserLoggedIn = () => user && user.role === "customer";

  const handleAddToCart = (shoe) => {
    // Check if shoe is already in the cart
    const isAlreadyInCart = cart.some((item) => item.id === shoe.id);
    if (isAlreadyInCart) {
      alert("This item is already in your cart.");
      return;
    }

    // Check if the product is available
    if (shoe.quantity > 0) {
      setCart((prevCart) => [...prevCart, shoe]);
    } else {
      alert("This product is out of stock.");
    }
  };

  const handleCheckout = () => {
    if (isUserLoggedIn()) {
      navigate('/checkout', { state: { cart } });
    } else {
      alert("Please log in or sign up to proceed to checkout.");
      navigate('/login'); // Redirect to login/signup page
    }
  };

  const handleBuyNow = (shoe) => {
    if (isUserLoggedIn()) {
      navigate('/checkout', { state: { cart: [shoe] } });
    } else {
      alert("Please log in or sign up to buy this product.");
      navigate('/login'); // Redirect to login/signup page
    }
  };

  const handleBack = () => {
    if (isUserLoggedIn()) {
      navigate('/LandingPage2');
    } else {
      navigate('/');
    }
  };

  const goToCartPage = () => {
    navigate('/cart', { state: { cart } });
  };

  return (
    <div className="shoes-container">
      <div className="shoes-header">
        <h1 className="shoes-title">Marketplace</h1>
        <div className="shoes-header-buttons">
          <button className="shoes-back-btn" onClick={handleBack}>Back</button>
          <button className="cart-icon-btn" onClick={goToCartPage}>
            <i className="fas fa-shopping-cart"></i>
          </button>
        </div>
      </div>

      <div className="shoes-list">
        {shoes.map((shoe) => (
          <div className="shoe-item" key={shoe.id}>
            {shoe.image && <img className="shoe-img" src={`http://localhost:8800${shoe.image}`} alt={shoe.prod_name} />}
            <h2 className="shoe-name">{shoe.prod_name}</h2>
            <p className="shoe-description">{shoe.prod_description}</p>
            <span className="shoe-price">₱{shoe.price}</span>
            <div className="shoe-quantity">
              <span>Available: {shoe.quantity}</span>
            </div>
            <button className="add-to-cart-btn" onClick={() => handleAddToCart(shoe)}>
              Add to Cart
            </button>
            <button className="buy-now-btn" onClick={() => handleBuyNow(shoe)}>
              Buy Now
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="cart-summary">
          <h2 className="cart-title">Your Cart</h2>
          <ul className="cart-items-list">
            {cart.map((item, index) => (
              <li className="cart-item" key={index}>
                {item.prod_name} - ₱{item.price}
              </li>
            ))}
          </ul>
          <button className="proceed-checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Product;
