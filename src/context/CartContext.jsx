import { createContext, useContext, useState, useCallback } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems,       setCartItems]       = useState(() => getStorageItem(STORAGE_KEYS.CART, []));
  const [isDrawerOpen,    setIsDrawerOpen]    = useState(false);
  const [isCheckoutOpen,  setIsCheckoutOpen]  = useState(false);

  // ── internal sync helper ──────────────────────────────────────────────────
  const _commit = (next) => {
    setStorageItem(STORAGE_KEYS.CART, next);
    window.dispatchEvent(new Event('storage'));
    return next;
  };

  // ── cart actions ──────────────────────────────────────────────────────────
  const addToCart = useCallback((item) => {
    setCartItems(prev => {
      const idx  = prev.findIndex(i => i.cartId === item.cartId);
      const next = idx >= 0
        ? prev.map((i, j) => j === idx ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: item.quantity ?? 1 }];
      return _commit(next);
    });
  }, []);

  const removeFromCart = useCallback((cartId) => {
    setCartItems(prev => _commit(prev.filter(i => i.cartId !== cartId)));
  }, []);

  const updateQuantity = useCallback((cartId, qty) => {
    if (qty < 1) return;
    setCartItems(prev => _commit(prev.map(i => i.cartId === cartId ? { ...i, quantity: qty } : i)));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems(_commit([]));
  }, []);

  // ── derived ───────────────────────────────────────────────────────────────
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  // ── drawer & checkout ─────────────────────────────────────────────────────
  const openDrawer    = useCallback(() => setIsDrawerOpen(true),  []);
  const closeDrawer   = useCallback(() => setIsDrawerOpen(false), []);
  const openCheckout  = useCallback(() => { setIsDrawerOpen(false); setIsCheckoutOpen(true);  }, []);
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, cartTotal,
      addToCart, removeFromCart, updateQuantity, clearCart,
      isDrawerOpen,   openDrawer,   closeDrawer,
      isCheckoutOpen, openCheckout, closeCheckout,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
};
