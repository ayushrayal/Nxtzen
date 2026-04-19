import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProductById } from '../utils/dataLoader';
import { useCart } from '../context/CartContext';
import './ProductDetails.scss';

const ProductDetails = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const product    = getProductById(id);

  const { addToCart, openDrawer, openCheckout } = useCart();

  const availableColors = product ? Object.keys(product.colors) : [];

  const [selectedColor,    setSelectedColor]    = useState('');
  const [selectedSize,     setSelectedSize]     = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (product) {
      setSelectedColor(Object.keys(product.colors)[0]);
      setSelectedSize(product.sizes[0]);
      setActiveImageIndex(0);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/products" className="btn-primary" style={{ marginTop: '1.5rem' }}>
          Back to Products
        </Link>
      </div>
    );
  }

  const currentImages  = product.colors[selectedColor] || [];
  const activeImage    = currentImages[activeImageIndex] || '';

  const handleColorChange = color => {
    setSelectedColor(color);
    setActiveImageIndex(0);
  };

  const handleNext = () => setActiveImageIndex(p => (p + 1) % currentImages.length);
  const handlePrev = () => setActiveImageIndex(p => (p - 1 + currentImages.length) % currentImages.length);

  const buildCartItem = () => ({
    ...product,
    cartId:        `${product.id}-${selectedColor}-${selectedSize}`,
    selectedColor,
    selectedSize,
    quantity:      1,
    image:         activeImage,
  });

  const handleAddToCart = () => {
    addToCart(buildCartItem());
    toast.success(`${product.name} added to cart!`);
    openDrawer();
  };

  const handleBuyNow = () => {
    addToCart(buildCartItem());
    openCheckout();
  };

  return (
    <motion.div
      className="page-transition product-details-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={18} />  Back
        </button>

        <div className="product-details-content">
          {/* Gallery */}
          <div className="product-gallery-container">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={activeImage}
                alt={`${product.name} in ${selectedColor}`}
                className="main-image"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0  }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            {currentImages.length > 1 && (
              <div className="gallery-controls">
                <button onClick={handlePrev} className="gallery-btn"><ChevronLeft /></button>
                <button onClick={handleNext} className="gallery-btn"><ChevronRight /></button>
              </div>
            )}

            {currentImages.length > 1 && (
              <div className="gallery-thumbnails">
                {currentImages.map((img, idx) => (
                  <motion.button
                    key={idx}
                    className={`thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    whileHover={{ scale: 1.03 }}
                  >
                    <img src={img} alt="thumbnail" />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <motion.div
            className="product-info-block"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0  }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <h1 className="title">{product.name}</h1>
            <p className="price">${product.price.toFixed(2)}</p>
            <p className="description">{product.description}</p>

            {/* Color selector */}
            <div className="options-group">
              <h4>Color — <span style={{ fontWeight: 400, textTransform: 'capitalize' }}>{selectedColor}</span></h4>
              <div className="color-selector">
                {availableColors.map(color => (
                  <button
                    key={color}
                    className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    aria-label={`Color: ${color}`}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="options-group">
              <h4>Size</h4>
              <div className="size-selector">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="action-buttons">
              <button className="btn-secondary add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="btn-primary buy-now-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
