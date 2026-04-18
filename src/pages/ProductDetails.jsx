import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProductById } from '../utils/dataLoader';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';
import CheckoutModal from '../components/CheckoutModal';
import './ProductDetails.scss';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);

  const availableColors = product ? Object.keys(product.colors) : [];
  
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (product) {
      const initialColor = Object.keys(product.colors)[0];
      setSelectedColor(initialColor);
      setSelectedSize(product.sizes[0]);
      setActiveImageIndex(0);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/products" className="btn-primary" style={{ marginTop: '1rem' }}>Back to Products</Link>
      </div>
    );
  }

  const currentImages = product.colors[selectedColor] || [];
  const activeImage = currentImages[activeImageIndex] || '';

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setActiveImageIndex(0);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % currentImages.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
  };

  const handleAddToCart = () => {
    const currentCart = getStorageItem(STORAGE_KEYS.CART, []);
    const cartItem = {
      ...product,
      cartId: `${product.id}-${selectedColor}-${selectedSize}`,
      selectedColor,
      selectedSize,
      quantity: 1,
      image: activeImage // Store specific image in cart
    };

    const existingIndex = currentCart.findIndex(item => item.cartId === cartItem.cartId);
    if (existingIndex >= 0) {
      currentCart[existingIndex].quantity += 1;
    } else {
      currentCart.push(cartItem);
    }
    
    setStorageItem(STORAGE_KEYS.CART, currentCart);
    import('react-hot-toast').then(toast => toast.default.success(`${product.name} added to cart!`));
    window.dispatchEvent(new Event('storage'));
  };

  const handleBuyNow = () => {
    setIsModalOpen(true);
  };

  const handleCheckoutSuccess = (orderData) => {
    // Orders updated via Cart/Modal, but we format the item properly here first if needed
    const orders = getStorageItem(STORAGE_KEYS.ORDERS, []);
    orders.push({
      id: Date.now(),
      date: new Date().toISOString(),
      items: [{...product, selectedColor, selectedSize, quantity: 1, image: activeImage}],
      total: product.price,
      shipping: orderData
    });
    setStorageItem(STORAGE_KEYS.ORDERS, orders);
    setIsModalOpen(false);
    import('react-hot-toast').then(toast => toast.default.success('Order placed successfully! Redirecting to profile...'));
    navigate('/profile');
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
          <ArrowLeft size={20} /> Back
        </button>

        <div className="product-details-content">
          <div className="product-gallery-container">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImage}
                src={activeImage} 
                alt={`${product.name} in ${selectedColor}`} 
                className="main-image"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
            
            {currentImages.length > 1 && (
              <div className="gallery-controls">
                <button onClick={handlePrevImage} className="gallery-btn"><ChevronLeft /></button>
                <button onClick={handleNextImage} className="gallery-btn"><ChevronRight /></button>
              </div>
            )}
            
            {currentImages.length > 1 && (
              <div className="gallery-thumbnails">
                {currentImages.map((img, idx) => (
                  <button 
                    key={idx} 
                    className={`thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={img} alt="thumbnail" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <motion.div 
            className="product-info-block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="title">{product.name}</h1>
            <p className="price">${product.price.toFixed(2)}</p>
            <p className="description">{product.description}</p>

            <div className="options-group">
              <h4>Color</h4>
              <div className="color-text-display">{selectedColor}</div>
              <div className="color-selector">
                {availableColors.map(color => (
                  <button 
                    key={color}
                    className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    aria-label={`Select color ${color}`}
                    title={color}
                  />
                ))}
              </div>
            </div>

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

      {isModalOpen && (
        <CheckoutModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleCheckoutSuccess} 
          directProduct={{...product, selectedColor, selectedSize, quantity: 1, image: activeImage}}
        />
      )}
    </motion.div>
  );
};

export default ProductDetails;
