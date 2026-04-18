import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';
import CartItem from '../components/CartItem';
import CheckoutModal from '../components/CheckoutModal';
import './Cart.scss';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCartItems(getStorageItem(STORAGE_KEYS.CART, []));
    
    const handleStorageChange = () => {
      setCartItems(getStorageItem(STORAGE_KEYS.CART, []));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateQuantity = (cartId, newQuantity) => {
    const updatedCart = cartItems.map(item => 
      item.cartId === cartId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    setStorageItem(STORAGE_KEYS.CART, updatedCart);
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (cartId) => {
    const updatedCart = cartItems.filter(item => item.cartId !== cartId);
    setCartItems(updatedCart);
    setStorageItem(STORAGE_KEYS.CART, updatedCart);
    window.dispatchEvent(new Event('storage'));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const handleCheckoutSuccess = (orderData) => {
    const orders = getStorageItem(STORAGE_KEYS.ORDERS, []);
    orders.push({
      id: Date.now(),
      date: new Date().toISOString(),
      items: [...cartItems],
      total: calculateSubtotal(),
      shipping: orderData
    });
    setStorageItem(STORAGE_KEYS.ORDERS, orders);
    
    // Clear cart
    setCartItems([]);
    setStorageItem(STORAGE_KEYS.CART, []);
    window.dispatchEvent(new Event('storage'));

    setIsModalOpen(false);
    import('react-hot-toast').then(toast => toast.default.success('Order placed successfully!'));
    navigate('/profile');
  };

  return (
    <motion.div 
      className="page-transition cart-page container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="page-title">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart glass-panel">
          <h3>Your cart is empty.</h3>
          <p>Explore our highly curated collection to discover your next essential.</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            <AnimatePresence>
              {cartItems.map((item) => (
                <CartItem 
                  key={item.cartId} 
                  item={item} 
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                />
              ))}
            </AnimatePresence>
          </div>

          <div className="cart-summary glass-panel">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>

            <button className="btn-primary checkout-btn" onClick={() => setIsModalOpen(true)}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <CheckoutModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleCheckoutSuccess} 
        />
      )}
    </motion.div>
  );
};

export default Cart;
