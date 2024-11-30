import React from 'react';

// Footer component that renders the footer section of the web application
const Footer = () => {
  return (
    <footer>
      {/* Display copyright information */}
      <p>&copy; 2024 Sample Predictive Maintenance System | Developed by Joseph McGuire</p>
      <p>
        {/* Links to GitHub, Personal Website, and LinkedIn with appropriate attributes for security */}
        <a href="https://github.com/joseph-c-mcguire" target="_blank" rel="noopener noreferrer">GitHub</a> | 
        <a href="https://joseph-c-mcguire.github.io/" target="_blank" rel="noopener noreferrer"> Personal Website</a> | 
        <a href="https://www.linkedin.com/in/joseph-c-mcg/" target="_blank" rel="noopener noreferrer"> LinkedIn</a>
      </p>
    </footer>
  );
};

export default Footer;