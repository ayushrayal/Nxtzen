import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import { CartProvider }  from './context/CartContext';
import LoadingScreen     from './components/LoadingScreen';
import Navbar            from './components/Navbar';
import Footer            from './components/Footer';
import CartDrawer        from './components/CartDrawer';
import CheckoutFlow      from './components/CheckoutFlow';

import Home           from './pages/Home';
import Products       from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart           from './pages/Cart';
import Profile        from './pages/Profile';
import About          from './pages/About';

// ─── Inner app (needs Router + Cart context) ───────────────────────────────────
function AppInner() {
  const location = useLocation();

  // ── Loading state: show premium splash for exactly 2 s on every page load ──
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []); // runs once per mount = once per browser reload

  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background:   '#000',
            color:        '#fff',
            borderRadius: '4px',
            fontSize:     '0.875rem',
            padding:      '0.75rem 1.25rem',
          },
          duration: 3000,
        }}
      />

      {/* ── Global overlays (drawer + checkout) ── */}
      <CartDrawer />
      <CheckoutFlow />

      {/* ── Navbar + routes — hidden under the loader but always mounted ── */}
      {!isLoading && <Navbar />}

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* "/" now redirects straight to /home — loader is at App level */}
            <Route path="/"            element={<Navigate to="/home" replace />} />
            <Route path="/home"        element={<Home />}           />
            <Route path="/products"    element={<Products />}       />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart"        element={<Cart />}           />
            <Route path="/profile"     element={<Profile />}        />
            <Route path="/about"       element={<About />}          />
            {/* Catch-all → home */}
            <Route path="*"            element={<Navigate to="/home" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isLoading && <Footer />}

      {/* ── Loading overlay: fixed on top, AnimatePresence handles exit animation ── */}
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loading-screen" />}
      </AnimatePresence>
    </>
  );
}

// ─── Root (CartProvider wraps everything) ─────────────────────────────────────
function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  );
}

export default App;
