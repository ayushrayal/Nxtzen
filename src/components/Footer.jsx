import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-main">
        {/* Brand */}
        <div>
          <Link to="/" className="footer-logo">NXTZEN</Link>
          <p className="footer-desc">
            Redefining modern fashion through minimalism,
            precision, and superior craftsmanship.
          </p>
        </div>

        {/* Explore */}
        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact</h4>
          <p>
            <a href="mailto:nxtzen@gmail.com">nxtzen@gmail.com</a><br />
            +1 (555) 012-3456
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} NXTZEN. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
