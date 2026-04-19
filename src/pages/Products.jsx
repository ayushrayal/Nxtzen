import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductsByCategory } from '../utils/dataLoader';
import ProductCard from '../components/ProductCard';
import './Products.scss';

const categories = ['All', 'Jeans', 'Shirts', 'T-Shirts'];

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const filteredProducts = getProductsByCategory(activeCategory);

  return (
    <motion.div
      className="page-transition products-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        {/* ── Title + filters ── */}
        <motion.div
          className="products-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <h1 className="page-title">The Collection</h1>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Product grid — lives in SAME container, clearly below filters ── */}
        <motion.div
          layout
          className="product-grid products-grid-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Products;
