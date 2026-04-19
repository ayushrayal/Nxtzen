import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartDrawer.scss';

const CartDrawer = () => {
  const {
    cartItems, cartTotal,
    removeFromCart, updateQuantity,
    isDrawerOpen, closeDrawer, openCheckout,
  } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Dim overlay */}
          <motion.div
            className="drawer-overlay"
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeDrawer}
          />

          {/* Drawer panel */}
          <motion.aside
            className="cart-drawer"
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="drawer-header">
              <div className="drawer-title">
                <ShoppingBag size={17} strokeWidth={1.5} />
                <span>Your Cart</span>
                {cartItems.length > 0 && (
                  <span className="drawer-badge">{cartItems.length}</span>
                )}
              </div>
              <button className="drawer-close" onClick={closeDrawer} aria-label="Close cart">
                <X size={19} strokeWidth={1.5} />
              </button>
            </div>

            {/* Item list */}
            <div className="drawer-body">
              {cartItems.length === 0 ? (
                <motion.div
                  className="drawer-empty"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <ShoppingBag size={52} strokeWidth={0.8} />
                  <p>Your cart is empty.</p>
                  <button className="btn-secondary" onClick={closeDrawer}>
                    Continue Shopping
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence initial={false}>
                  {cartItems.map((item, i) => (
                    <motion.div
                      key={item.cartId}
                      className="drawer-item"
                      layout
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0,  transition: { delay: i * 0.05 } }}
                      exit={{ opacity: 0, x: 24, height: 0, paddingTop: 0, paddingBottom: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="drawer-item-img"
                      />

                      <div className="drawer-item-body">
                        <div className="drawer-item-header">
                          <h4 className="drawer-item-name">{item.name}</h4>
                          <button
                            className="drawer-remove"
                            onClick={() => removeFromCart(item.cartId)}
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <p className="drawer-item-meta">
                          <span
                            className="drawer-swatch"
                            style={{ backgroundColor: item.selectedColor }}
                          />
                          {item.selectedColor} · {item.selectedSize}
                        </p>

                        <div className="drawer-item-foot">
                          <div className="qty-ctrl">
                            <button
                              onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} strokeWidth={2} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} strokeWidth={2} />
                            </button>
                          </div>
                          <span className="drawer-item-price">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="drawer-footer">
                <div className="drawer-total-row">
                  <span>Total</span>
                  <motion.span
                    key={cartTotal}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="drawer-total-amount"
                  >
                    ${cartTotal.toFixed(2)}
                  </motion.span>
                </div>
                <p className="drawer-ship-note">Free shipping on all orders</p>

                <button className="btn-primary drawer-cta" onClick={openCheckout}>
                  Proceed to Checkout
                </button>
                <button className="drawer-continue-btn" onClick={closeDrawer}>
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
