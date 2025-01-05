import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './add.css';

const Add = () => {
  const [shoe, setShoe] = useState({
    prod_name: '',
    prod_description: '',
    price: '',
    image: null,
    quantity: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setShoe((prev) => ({ ...prev, [name]: name === 'image' ? files[0] : value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!shoe.prod_name || !shoe.prod_description || !shoe.price || !shoe.image || !shoe.quantity) {
        alert('All fields are required!');
        return;
    }

    if (shoe.quantity <= 0 || shoe.price <= 0) {
        alert('Price and quantity must be greater than 0!');
        return;
    }

    // Add length validation
    if (shoe.prod_description.length > 255) {
        alert('Product description must be 255 characters or less!');
        return;
    }

    const formData = new FormData();
    formData.append('prod_name', shoe.prod_name);
    formData.append('prod_description', shoe.prod_description);
    formData.append('price', parseFloat(shoe.price)); // Convert to number
    formData.append('image', shoe.image);
    formData.append('quantity', parseInt(shoe.quantity)); // Convert to number

    try {
      const response = await axios.post('http://localhost:8800/shoes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data === "Successfully executed") {
        alert('Product added successfully!');
        navigate('/shoes');
      } else {
        alert('Failed to add product.');
      }
    } catch (err) {
      alert('Error: Failed to add product.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleClick(e);
  };

  return (
    <div className="form">
      <h1>Add New Item</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={shoe.prod_name}
          onChange={handleChange}
          name="prod_name"
        />
        <input
          type="text"
          placeholder="Product Description"
          value={shoe.prod_description}
          onChange={handleChange}
          name="prod_description"
        />
        <input
          type="file"
          onChange={handleChange}
          name="image"
        />
        <input
          type="number"
          placeholder="Price"
          value={shoe.price}
          onChange={handleChange}
          name="price"
          min="0"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={shoe.quantity}
          onChange={handleChange}
          name="quantity"
          min="0"
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default Add;
