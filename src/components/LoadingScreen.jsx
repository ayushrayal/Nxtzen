import { motion } from 'framer-motion';
import './LoadingScreen.scss';

/**
 * Full-screen premium loading overlay.
 * Rendered by App.jsx inside AnimatePresence so its exit animation plays
 * automatically when the parent removes it from the tree.
 */
const LoadingScreen = () => (
  <motion.div
    className="ls-root"
    // No enter animation on the container — appears instantly
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, scale: 1.04 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  >
    {/* Word-mark */}
    <motion.h1
      className="ls-logo"
      initial={{ opacity: 0, scale: 0.86, y: 16 }}
      animate={{ opacity: 1, scale: 1,    y: 0  }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      NXTZEN
    </motion.h1>

    {/* Tagline */}
    <motion.p
      className="ls-tagline"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.3, ease: 'easeOut' }}
    >
      Minimal &nbsp;·&nbsp; Modern &nbsp;·&nbsp; Essential
    </motion.p>

    {/* Thin progress line — fills over 2 s matching the timer */}
    <motion.div
      className="ls-bar-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <motion.div
        className="ls-bar-fill"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.85, delay: 0.15, ease: 'easeInOut' }}
      />
    </motion.div>
  </motion.div>
);

export default LoadingScreen;
