import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import './Shoes.css';

const Shoes = () => {
  const [shoes, setShoes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllShoes = async () => {
      try {
        const res = await axios.get("http://localhost:8800/shoes");
        setShoes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllShoes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:8800/shoes/" + id);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/');
  };

  return (
    <div>
      <div className="header">
        <h1>Admin Dashboard</h1>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="shoes">
        {shoes.map((shoe) => (
          <div className="shoe" key={shoe.id}>
            {shoe.image && <img src={`http://localhost:8800${shoe.image}`} alt={shoe.prod_name} />}
            <h2>{shoe.prod_name}</h2>
            <p>{shoe.prod_description}</p>
            <span>₱{shoe.price}</span>
            {/* Display the quantity available for each product */}
            <div className="quantity-container">
              <span>Quantity in stock: {shoe.quantity}</span>
            </div>
              <div className="button-container">
                <button className="delete" onClick={() => handleDelete(shoe.id)}>Delete</button>
              <button className="update">
              <Link to={`/update/${shoe.id}`}>Update</Link>
            </button>
              </div>

          </div>
        ))}
      </div>
      <button className="add">
        <Link to="/add">Add new item</Link>
      </button>
    </div>
  );
};

export default Shoes;
