import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Update = () => {
  const [shoe, setShoe] = useState({
    prod_name: '',
    prod_description: '',
    price: '',
    image: null,
    quantity: null,
  });
  const [currentImage, setCurrentImage] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShoe = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/shoes/${id}`);
        // Since we're returning data[0] from backend, we don't need to access it here
        setShoe({
          prod_name: res.data.prod_name,
          prod_description: res.data.prod_description,
          price: res.data.price,
          image: res.data.image,
          quantity: res.data.quantity,
        });
        setCurrentImage(res.data.image);
      } catch (err) {
        console.log(err);
        alert('Error fetching product data');
      }
    };
    fetchShoe();
}, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setShoe((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setShoe((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleClick(e);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!shoe.prod_name || !shoe.prod_description || !shoe.price || !shoe.quantity) {
      alert('All fields are required!');
      return;
    }

    if (shoe.quantity <= 0 || shoe.price <= 0) {
      alert('Price and quantity must be greater than 0!');
      return;
    }

    if (shoe.prod_description.length > 255) {
      alert('Product description must be 255 characters or less!');
      return;
    }

    const formData = new FormData();
    formData.append('prod_name', shoe.prod_name);
    formData.append('prod_description', shoe.prod_description);
    formData.append('price', parseFloat(shoe.price)); 
    formData.append('quantity', parseInt(shoe.quantity)); 
    if (shoe.image instanceof File) {
      formData.append('image', shoe.image);
    } else {
      formData.append('image', currentImage); // Send the existing image path
    }

    try {
      const response = await axios.put(`http://localhost:8800/shoes/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data === "Successfully updated") {
        alert('Product updated successfully!');
        navigate('/shoes');
      } else {
        alert('Failed to update product.');
      }
    } catch (err) {
      alert('Error: Failed to update product.');
    }
  };

  return (
    <div className="form">
      <h1>Update Item</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={shoe.prod_name || ''}
          onChange={handleChange}
          name="prod_name"
        />
        <input
          type="text"
          placeholder="Product Description"
          value={shoe.prod_description || ''}
          onChange={handleChange}
          name="prod_description"
        />
        {currentImage && (
          <div className="current-image">
            <p>Current Image:</p>
            <img 
              src={`http://localhost:8800${currentImage}`} 
              alt="Current product" 
              style={{ maxWidth: '200px', marginBottom: '10px' }}
            />
          </div>
        )}
        <label>Upload New Image (optional):</label>
        <input
          type="file"
          onChange={handleChange}
          name="image"
          accept="image/*"
        />
        <input
          type="number"
          placeholder="Price"
          value={shoe.price || ''}
          onChange={handleChange}
          name="price"
          min="0"
          step="0.01"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={shoe.quantity || ''}
          onChange={handleChange}
          name="quantity"
          min="0"
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default Update;