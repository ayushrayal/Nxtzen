import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Landing.scss';

const Landing = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('in'); // 'in' | 'hold' | 'out'

  useEffect(() => {
    // Fade-in → hold → fade-out → navigate
    // in: 0.7s  hold: 1.0s  out: 0.5s  total ≈ 2.2s
    const holdTimer = setTimeout(() => setPhase('out'), 1700);
    const navTimer  = setTimeout(() => navigate('/home'),  2200);
    return () => { clearTimeout(holdTimer); clearTimeout(navTimer); };
  }, [navigate]);

  return (
    <motion.div
      className="landing-screen"
      animate={{ opacity: phase === 'out' ? 0 : 1 }}
      transition={{ duration: phase === 'out' ? 0.5 : 0, ease: 'easeInOut' }}
    >
      {/* Brand wordmark */}
      <motion.h1
        className="landing-logo"
        initial={{ opacity: 0, scale: 0.88, y: 12 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        NXTZEN
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="landing-tagline"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
      >
        Minimal &nbsp;·&nbsp; Modern &nbsp;·&nbsp; Essential
      </motion.p>

      {/* Thin accent line */}
      <motion.span
        className="landing-line"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
};

export default Landing;
