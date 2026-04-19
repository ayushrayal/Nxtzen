import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import './Cart.scss';

const Cart = () => {
  const {
    cartItems, cartTotal,
    updateQuantity, removeFromCart,
    openCheckout,
  } = useCart();

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
        <div className="empty-cart">
          <h3>Your cart is empty.</h3>
          <p>Explore our curated collection to discover your next essential.</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            <AnimatePresence>
              {cartItems.map(item => (
                <CartItem
                  key={item.cartId}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeItem={removeFromCart}
                />
              ))}
            </AnimatePresence>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <button className="btn-primary checkout-btn" onClick={openCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
