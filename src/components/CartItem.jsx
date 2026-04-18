import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';
import './CartItem.scss';

const CartItem = ({ item, updateQuantity, removeItem }) => {
  return (
    <motion.div 
      className="cart-item glass-panel"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
    >
      <img src={item.image} alt={item.name} className="cart-item-image" />
      
      <div className="cart-item-details">
        <div className="cart-item-header">
          <h4>{item.name}</h4>
          <span className="price">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
        
        <p className="cart-item-meta">
          Color: <span className="swatch" style={{ backgroundColor: item.selectedColor }} /> 
          | Size: {item.selectedSize}
        </p>

        <div className="cart-item-actions">
          <div className="quantity-controls">
            <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} disabled={item.quantity <= 1}>
              <Minus size={16} />
            </button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)}>
              <Plus size={16} />
            </button>
          </div>

          <button className="remove-btn" onClick={() => removeItem(item.cartId)}>
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
