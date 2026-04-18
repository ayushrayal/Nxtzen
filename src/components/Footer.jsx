import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">NXTZEN</Link>
          <p className="footer-desc">
            Redefining modern fashion through minimalism and superior craftsmanship.
          </p>
        </div>
        
        <div className="footer-links">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
          </ul>
        </div>
        
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>Email: <a href="mailto:nxtzen@gmail.com">nxtzen@gmail.com</a></p>
          <p>Phone: +1 (555) 012-3456</p>
        </div>
      </div>
      
      <div className="footer-bottom container">
        <p>&copy; {currentYear} NXTZEN. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
