import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Ensure the CSS file is imported

// Header component definition
const Header = () => {
  // State to manage the menu open/close status
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to toggle the menu open/close status
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1>Predictive Maintenance System</h1>
        {/* Hamburger button to toggle the menu */}
        <button className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      {/* Navigation menu */}
      <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          {/* Navigation links */}
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/eda" onClick={toggleMenu}>Data Analysis Dashboard</Link></li>
          <li><Link to="/model-description" onClick={toggleMenu}>Model Description</Link></li>
          <li><Link to="/model-querying" onClick={toggleMenu}>Model Querying</Link></li>
          <li><Link to="/model-diagnostics" onClick={toggleMenu}>Model Diagnostics</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;