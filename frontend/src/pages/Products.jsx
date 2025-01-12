import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Products.css";

const Product = () => {
  const [shoes, setShoes] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();

 
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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        setUser(null); 
      }
    } else {
      setUser(null); 
    }
  }, []);


  const isUserLoggedIn = () => {
    return user && user.id;
  };


  const handleAddToCart = async (shoe) => {
    if (!isUserLoggedIn()) {
      alert("Please log in first.");
      navigate('/login');
      return;
    }

    const isAlreadyInCart = cart.some((item) => item.id === shoe.id);
    if (isAlreadyInCart) {
      alert("This item is already in your cart.");
      return;
    }

    if (shoe.quantity > 0) {
      try {
        const userId = user.id; 
        const response = await axios.post("http://localhost:8800/cart/add", {
          userID: userId,
          productID: shoe.id,
          quantity: 1,
        });

        if (response.data.success) {
          setCart((prevCart) => [...prevCart, shoe]);
          alert("Item added to cart successfully.");
        } else {
          alert("Failed to add item to cart.");
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
        alert("Could not add item to cart.");
      }
    } else {
      alert("This product is out of stock.");
    }
  };

  const handleMyOrders = () => {
    if (isUserLoggedIn()) {
      navigate('/UserOrders');
    } else {
      alert("Please log in to view your orders.");
      navigate('/login');
    }
  };


  const handleBuyNow = (shoe) => {
    if (isUserLoggedIn()) {
      navigate('/CheckoutPage', {
        state: {
          cart: [
            {
              ...shoe,
              quantity: 1, 
            },
          ],
        },
      });
    } else {
      alert("Please log in or sign up to buy this product.");
      navigate('/login'); 
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
    if (isUserLoggedIn()) {
      navigate('/cart');
    } else {
      alert("Please log in to view your cart.");
      navigate('/login');
    }
  };

  return (
    <div className="shoes-container">
      <div className="shoes-header">
        <h1 className="shoes-title">Marketplace</h1>
        <div className="shoes-header-buttons">
          <button className="back-button-products" onClick={handleBack}>Back</button>
          <button className="cart-icon-btn" onClick={goToCartPage}>
            <i className="fas fa-shopping-cart"></i>
          </button>
          <button className="my-orders-btn" onClick={handleMyOrders}>
            My Orders
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
    </div>
  );
};

export default Product;
