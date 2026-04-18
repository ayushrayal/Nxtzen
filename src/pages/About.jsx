import { motion } from 'framer-motion';
import './About.scss';

const About = () => {
  return (
    <motion.div 
      className="page-transition about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="about-hero">
        <div className="container">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Pioneering the Future of Minimalist Apparel.
          </motion.h1>
        </div>
      </div>

      <div className="container about-content">
        <section className="about-section">
          <h2>Who We Are</h2>
          <p>
            NXTZEN is a contemporary fashion house built on the principles of minimalism, 
            sustainability, and architectural design. Founded in 2026, we believe that 
            clothing should be an extension of one's identity—uncluttered, precise, 
            and effortlessly modern.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Offer</h2>
          <p>
            Our collections feature precision-engineered garments using premium, ethically 
            sourced materials. From relaxed denim to structural outerwear, every piece is 
            crafted to ensure longevity, ultimate comfort, and a striking silhouette.
          </p>
        </section>

        <section className="about-section">
          <h2>Location</h2>
          <p>
            <strong>NXTZEN Headquarters</strong><br/>
            100 Innovation Drive<br/>
            Metropolis, NY 10001<br/>
            United States
          </p>
        </section>
      </div>
    </motion.div>
  );
};

export default About;
