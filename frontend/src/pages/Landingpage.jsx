import React, { useState, useEffect } from 'react'; 
import { Link } from "react-router-dom";
import "./landingpage.css";
import logo from './images/LOGO.png'; 
import img1 from './images/img1.jpg';
import img2 from './images/img2.jpg';
import img3 from './images/img3.jpg';
import img4 from './images/topsel_img1.jpg';
import img5 from './images/topsel_img2.jpg';
import img6 from './images/topsel_img3.jpg';



const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      brand: "Welcome to VELODOOM",
      title: "Ride the legacy. Embrace the classic.",
      description: "We’re more than just a motorcycle shop – we’re a celebration of timeless design, exceptional craftsmanship, and the unbridled passion for the open road. Specializing in classic motorcycles, we bring enthusiasts a curated selection of bikes that define an era, along with the expertise to keep them running at their best.",
      image: img1 
    },
    {
      brand: "The All-New: Itachi 650",
      title: "A Revolution on Two Wheels",
      description: "Experience the perfect blend of power, style, and innovation with the all-new Itachi 650. Designed for riders who demand performance without compromising on elegance, this motorcycle redefines the thrill of the open road.",
      image: img2 
    },
    {
      brand: "VELODOOM Trackday",
      title: "Get ready to unleash the spirit of the open road at the Velodoom Trackday, an exclusive event for motorcycle enthusiasts!",
      description: "📅 Date: 03 - 07 - 25 📍 Location: Clark Speedway",
      image: img3 
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  return (
    <section className="hero-slider" id="home">
      {slides.map((slide, index) => (
        <Slide
          key={index}
          brand={slide.brand}
          title={slide.title}
          description={slide.description}
          imageSrc={slide.image}
          isActive={index === currentSlide}
        />
      ))}
      <button className="prev" onClick={prevSlide}>&#10094;</button>
      <button className="next" onClick={nextSlide}>&#10095;</button>
    </section>
  );
};

const Slide = ({ brand, title, description, imageSrc, isActive }) => (
  <div className={`slide ${isActive ? 'active' : ''}`}>
    <div className="content">
      <div className="brand">
        <span className="brand-name">{brand}</span>
      </div>
      <h1 className="title">{title}</h1>
      <p className="description">{description}</p>
    </div>
    <div className="image-container">
      <img src={imageSrc} alt={title} className="slide-image" /> 
    </div>
  </div>
);

const MotorcycleCard = ({ title, imageSrc }) => (
  <div className="selections-card">
    <div className="image-wrapper">
      <img src={imageSrc} alt={title} className="selections-image" />
    </div>
        <h3 className="selections-title">{title}</h3>
        <Link to="/Products" className="buy-button">Buy Now</Link>
      </div>
);

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-section">
        <h2 className="footer-title">VELODOOM Dealership</h2>
        <div className="contact-info">
          <p><i className="fas fa-map-marker-alt" /> 123 Velodoom Avenue, Paco, Manila</p>
          <p><i className="fas fa-phone" /> (+63) 12345-6789</p>
          <p><i className="fas fa-envelope" /> inquiry@velodoomshop.com</p>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2024 Velodoom Shop. All Rights Reserved</p>
    </div>
  </footer>
);


const LandingPage = () => {
  useEffect(() => {
    document.title = "Velodoom - Ride the Legacy";
    const metaDescription = document.querySelector("meta[name='description']");
    if (!metaDescription) {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content = "Discover Velodoom: The home for classic motorcycles.";
      document.head.appendChild(newMeta);
    } else {
      metaDescription.content = "Discover Velodoom: The home for classic motorcycles.";
    }
  }, []);

  return (
    <div>
      <nav>
      <a href="/" className="logo">
      <img src={logo} alt="VELODOOM Logo" className="logo-image" />
      </a>
        <button className="menu-toggle" aria-label="Toggle navigation">
          <i className="fas fa-bars" />
        </button>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#toppicks">Top Picks</a></li>
          <li><a href="#locateus">Locate Us</a></li>
          <li><Link to="/products">Shop</Link></li>
        </ul>
        <div className="login-landingpage">
          <Link to="/login" className="log-in">Log In / Sign Up</Link>
        </div>
      </nav>

      <HeroSlider />

      <section className="topselect-section" id="toppicks">
        <h2 className="topselect-title">The Best Motorcycles That Redefine the Ride!</h2>
        <p className="topselect-description">Select from these top motorcycles.</p>
        <div className="selections-grid">
          <MotorcycleCard title="Itachi Z650" imageSrc={img4} />
          <MotorcycleCard title="Ninja 411" imageSrc={img5} />
          <MotorcycleCard title="Minato 650rr" imageSrc={img6} />
        </div>
      </section>

      <section className="locate-section" id="locateus">
        <div className="section-header">
          <h2 className="section-title">Locate Us</h2>
          <p className="section-description">
            Visit us at our shop for premium motorcycles, expert services, and accessories.
            We’re excited to welcome you!
          </p>
        </div>
        <div className="location-container">
          <div className="location-info">
            <h3>Our Address</h3>
            <p>123 Velodoom Avenue, Paco, Manila, Philippines</p>
            <h3>Operating Hours</h3>
            <p>Mon - Sat: 8:00 AM - 7:00 PM</p>
            <p>Sun: Closed</p>
            <h3>Contact Us</h3>
            <p>Phone: (+63) 12345-6789</p>
            <p>Email: contactus@velodoomshop.com</p>
          </div>
          <div className="location-map">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193570.8678040346!2d-74.11808523514614!3d40.70582532395883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259af506d7537%3A0xd0891f05d4e567ed!2sPaco%2C%20Manila!5e0!3m2!1sen!2sph!4v1699945593241" 
              width="100%" 
              height="300" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              title="Velodoom Location Map"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
