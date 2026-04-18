import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ProductCard.scss';

const ProductCard = ({ product, index = 0 }) => {
  const availableColors = Object.keys(product.colors || {});
  const [activeColor, setActiveColor] = useState(availableColors[0]);
  
  const displayImage = product.colors[activeColor] ? product.colors[activeColor][0] : '';

  return (
    <motion.div 
      className="product-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.id}`} className="product-image-container">
        <AnimatePresence mode="wait">
          <motion.img 
            key={displayImage}
            src={displayImage} 
            alt={product.name} 
            className="product-image" 
            loading="lazy" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
        <div className="product-overlay">
          <span>View Details</span>
        </div>
      </Link>
      
      <div className="product-info">
        <div className="product-header">
          <h3 className="product-title">{product.name}</h3>
          <span className="product-price">${product.price.toFixed(2)}</span>
        </div>
        <p className="product-desc">{product.description.substring(0, 60)}...</p>
        
        <div className="product-meta">
          <div className="colors">
            {availableColors.map(color => (
              <span 
                key={color} 
                className={`color-swatch ${activeColor === color ? 'active' : ''}`}
                style={{ backgroundColor: color }} 
                onClick={(e) => {
                  e.preventDefault();
                  setActiveColor(color);
                }}
              />
            ))}
          </div>
          <div className="sizes">
            {product.sizes.map(size => (
              <span key={size} className="size-badge">{size}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
