import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../utils/dataLoader';
import ProductCard from '../components/ProductCard';
import './Home.scss';

const Home = () => {
  const featuredProducts = getAllProducts().slice(0, 3); // Get first 3 products for featured

  return (
    <motion.div 
      className="page-transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=2000&q=80" 
            alt="NXTZEN Hero" 
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="container hero-content">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="hero-title">Redefine Your Reality.</h1>
            <p className="hero-subtitle">
              Premium quality, minimalist design, and an effortlessly modern aesthetic. 
              Step into the future of fashion.
            </p>
            <Link to="/products" className="btn-primary hero-btn">
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>Featured Essentials</h2>
          <Link to="/products" className="view-all-link">View All</Link>
        </motion.div>
        
        <div className="product-grid">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
