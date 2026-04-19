import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../utils/dataLoader';
import ProductCard from '../components/ProductCard';
import './Home.scss';

// Staggered container for hero text
const heroContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 }
  }
};
const heroWord = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const Home = () => {
  const featuredProducts = getAllProducts().slice(0, 3);

  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2000&q=80"
            alt="NXTZEN fashion editorial"
          />
          <div className="hero-overlay" />
        </div>

        <div className="hero-content container">
          <motion.div
            className="hero-text"
            variants={heroContainer}
            initial="hidden"
            animate="show"
          >
            <motion.span className="hero-eyebrow" variants={heroWord}>
              New Collection 2026
            </motion.span>
            <motion.h1 className="hero-title" variants={heroWord}>
              Minimal.<br />Modern.<br />Essential.
            </motion.h1>
            <motion.p className="hero-subtitle" variants={heroWord}>
              Premium quality. Architectural design. An effortlessly future-forward aesthetic.
            </motion.p>
            <motion.div variants={heroWord}>
              <Link to="/products" className="btn-primary hero-cta">
                Shop Now
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="hero-scroll-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
        >
          <span />
        </motion.div>
      </section>

      {/* ── Featured Products ── */}
      <section className="featured section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Featured Essentials</h2>
            <Link to="/products" className="view-all-link">View All</Link>
          </motion.div>

          <div className="product-grid">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Banner ── */}
      <section className="brand-banner">
        <div className="container brand-banner-inner">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="brand-banner-title">Crafted for those who demand more.</h2>
            <p className="brand-banner-sub">
              Every stitch, every silhouette — a commitment to enduring style.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Link to="/about" className="btn-secondary">Our Story</Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
