import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Landing.scss';

const Landing = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Start fade-out after 2s, then navigate after the animation completes (0.8s)
    const fadeOutTimer = setTimeout(() => setVisible(false), 2000);
    const navTimer = setTimeout(() => navigate('/home'), 2800);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className="landing-wrapper">
      <AnimatePresence>
        {visible && (
          <motion.div
            className="landing-container"
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <motion.h1
              className="landing-logo"
              initial={{ opacity: 0, scale: 0.92, letterSpacing: '0.2em' }}
              animate={{ opacity: 1, scale: 1, letterSpacing: '0.5em' }}
              transition={{ duration: 1.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              NXTZEN
            </motion.h1>

            <motion.p
              className="landing-tagline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.4, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
            >
              Redefine Your Reality.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;
