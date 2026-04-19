import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Navbar.scss';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const { cartCount, openDrawer } = useCart();

  useEffect(() => {
    const onScroll  = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

  const navLinks = [
    { name: 'Products', path: '/products' },
    { name: 'About',    path: '/about'    },
  ];

  return (
    <motion.nav
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="navbar-inner">
        {/* Left — nav links (desktop) */}
        <div className="nav-left desktop-only">
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Center — logo */}
        <Link to="/home" className="navbar-logo">NXTZEN</Link>

        {/* Right — icons */}
        <div className="nav-right">
          {/* Cart opens drawer */}
          <button className="icon-btn" onClick={openDrawer} aria-label="Open cart">
            <ShoppingCart size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <motion.span
                className="cart-badge"
                key={cartCount}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          <Link to="/profile" className="icon-btn" aria-label="My profile">
            <User size={20} strokeWidth={1.5} />
          </Link>

          <button
            className="icon-btn mobile-only"
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
