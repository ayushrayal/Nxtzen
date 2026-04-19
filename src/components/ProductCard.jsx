import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import './ProductCard.scss';

const ProductCard = ({ product, index = 0 }) => {
  const availableColors = Object.keys(product.colors || {});
  const [activeColor, setActiveColor] = useState(availableColors[0]);

  const displayImage = product.colors[activeColor]?.[0] ?? '';

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="card-image-wrap">
        <AnimatePresence mode="wait">
          <motion.img
            key={displayImage}
            src={displayImage}
            alt={product.name}
            className="card-image"
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>

        {/* Overlay */}
        <div className="card-overlay">
          <span className="card-overlay-label">View Product</span>
        </div>
      </Link>

      {/* Info */}
      <div className="card-info">
        <div className="card-info-top">
          <h3 className="card-name">{product.name}</h3>
          <span className="card-price">${product.price.toFixed(2)}</span>
        </div>

        {/* Color swatches */}
        {availableColors.length > 0 && (
          <div className="card-swatches">
            {availableColors.map(color => (
              <button
                key={color}
                className={`color-swatch ${activeColor === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={e => { e.preventDefault(); setActiveColor(color); }}
                aria-label={`Color: ${color}`}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
