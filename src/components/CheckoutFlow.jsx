import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronRight, ChevronLeft,
  CheckCircle, Loader2, AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { sendOrderEmail } from '../services/emailService';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';
import { generateWhatsAppLink, redirectToWhatsApp } from '../utils/whatsapp';
import './CheckoutFlow.scss';

// ─── Step slide animation ─────────────────────────────────────────────────────
const stepVariants = {
  enter:  dir => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   dir => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

const STEPS = [
  { id: 'shipping', label: 'Shipping'  },
  { id: 'summary',  label: 'Summary'   },
  { id: 'confirm',  label: 'Confirmed' },
];

// ─── Main component ───────────────────────────────────────────────────────────
const CheckoutFlow = () => {
  const { cartItems, cartTotal, clearCart, isCheckoutOpen, closeCheckout } = useCart();

  const savedProfile = getStorageItem(STORAGE_KEYS.PROFILE, {});

  const [step,      setStep]      = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading,   setLoading]   = useState(false);
  const [orderId,   setOrderId]   = useState(null);
  const [waLink,    setWaLink]    = useState('');
  const [errors,    setErrors]    = useState({});

  const [form, setForm] = useState({
    name:    savedProfile.name    || '',
    email:   savedProfile.email   || '',
    phone:   savedProfile.phone   || '',
    address: savedProfile.address || '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())    errs.name    = 'Full name is required.';
    if (!form.email.trim())   errs.email   = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                              errs.email   = 'Enter a valid email.';
    if (!form.phone.trim())   errs.phone   = 'Phone number is required.';
    if (!form.address.trim()) errs.address = 'Delivery address is required.';
    return errs;
  };

  const advance = async () => {
    // ── Step 0 → 1 (validate shipping) ───────────────────────────────────────
    if (step === 0) {
      const errs = validate();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setDirection(1);
      setStep(1);
      return;
    }

    // ── Step 1 → 2 (place order) ──────────────────────────────────────────────
    if (step === 1) {
      setLoading(true);
      try {
        const id      = Date.now();
        const payload = {
          id,
          name: form.name.trim(), email: form.email.trim(),
          phone: form.phone.trim(), address: form.address.trim(),
          items: cartItems, directProduct: null,
          total: cartTotal,
        };

        // Send Email via EmailJS
        const emailSent = await sendOrderEmail(payload);
        if (!emailSent) {
          console.warn('[Checkout] Email failed to send, but proceeding with order placement.');
        }

        const waLink = generateWhatsAppLink({
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          items: cartItems,
          total: cartTotal,
          id
        });
        setWaLink(waLink);

        // Persist order
        const orders = getStorageItem(STORAGE_KEYS.ORDERS, []);
        orders.push({
          id,
          date:     new Date().toISOString(),
          items:    [...cartItems],
          total:    cartTotal,
          shipping: { name: form.name, address: form.address },
        });
        setStorageItem(STORAGE_KEYS.ORDERS, orders);

        // Persist profile
        setStorageItem(STORAGE_KEYS.PROFILE, payload);

        // Clear cart
        clearCart();
        setOrderId(id);
        
        toast.success("Order placed! Handing off to WhatsApp...", { duration: 3000 });

        setTimeout(() => {
          redirectToWhatsApp(waLink);
        }, 1500);

        setDirection(1);
        setStep(2);
      } catch (err) {
        console.error('[Checkout] Error:', err);
        toast.error('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  const back = () => {
    if (step === 0) { handleClose(); return; }
    setDirection(-1);
    setStep(prev => prev - 1);
  };

  const handleClose = () => {
    closeCheckout();
    // Reset for next open
    setTimeout(() => { setStep(0); setErrors({}); }, 400);
  };

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <motion.div
          className="cf-backdrop"
          key="cf-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={e => { if (e.target === e.currentTarget && step !== 1) handleClose(); }}
        >
          <motion.div
            className="cf-panel"
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{ opacity: 0, y: 36, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="cf-header">
              <StepBar step={step} />
              {step < 2 && (
                <button className="cf-close" onClick={handleClose} aria-label="Close checkout">
                  <X size={18} strokeWidth={1.5} />
                </button>
              )}
            </div>

            {/* ── Step content ────────────────────────────────────────────── */}
            <div className="cf-body">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                >
                  {step === 0 && (
                    <StepShipping form={form} errors={errors} onChange={handleChange} />
                  )}
                  {step === 1 && (
                    <StepSummary items={cartItems} total={cartTotal} form={form} />
                  )}
                  {step === 2 && (
                    <StepConfirmed
                      orderId={orderId}
                      form={form}
                      total={cartTotal}
                      waLink={waLink}
                      onDone={handleClose}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Footer nav ──────────────────────────────────────────────── */}
            {step < 2 && (
              <div className="cf-footer">
                <button className="btn-secondary cf-back" onClick={back} disabled={loading}>
                  {step === 0 ? 'Cancel' : <><ChevronLeft size={15} /> Back</>}
                </button>
                <button className="btn-primary cf-next" onClick={advance} disabled={loading}>
                  {loading ? (
                    <><Loader2 size={15} className="cf-spin" /> Placing Order…</>
                  ) : step === 1 ? (
                    <><CheckCircle size={15} /> Place Order</>
                  ) : (
                    <>Next <ChevronRight size={15} /></>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Step indicator bar ───────────────────────────────────────────────────────
const StepBar = ({ step }) => (
  <div className="cf-steps">
    {STEPS.map((s, i) => (
      <div key={s.id} className={`cf-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
        <div className="cf-step-dot">{i < step ? '✓' : i + 1}</div>
        <span className="cf-step-label">{s.label}</span>
        {i < STEPS.length - 1 && (
          <div className={`cf-step-line ${i < step ? 'done' : ''}`} />
        )}
      </div>
    ))}
  </div>
);

// ─── Step 1: Shipping ─────────────────────────────────────────────────────────
const StepShipping = ({ form, errors, onChange }) => (
  <div className="cf-step-content">
    <h2 className="cf-title">Shipping Information</h2>
    <p className="cf-subtitle">Where should we send your order?</p>

    <div className="cf-form-grid">
      <Field label="Full Name"      name="name"    type="text"  placeholder="Jane Doe"              value={form.name}    onChange={onChange} error={errors.name}    />
      <Field label="Email Address"  name="email"   type="email" placeholder="jane@example.com"       value={form.email}   onChange={onChange} error={errors.email}   />
      <Field label="Phone Number"   name="phone"   type="tel"   placeholder="+91 98765 43210"        value={form.phone}   onChange={onChange} error={errors.phone}   />
      <div className="cf-full">
        <div className="input-group">
          <label>Delivery Address</label>
          <textarea
            name="address"
            rows="3"
            placeholder="123, Street Name, City, State – PIN"
            value={form.address}
            onChange={onChange}
            className={errors.address ? 'input-error' : ''}
          />
          {errors.address && (
            <span className="error-msg">
              <AlertCircle size={12} /> {errors.address}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

// ─── Step 2: Summary ──────────────────────────────────────────────────────────
const StepSummary = ({ items, total, form }) => (
  <div className="cf-step-content">
    <h2 className="cf-title">Order Summary</h2>
    <p className="cf-subtitle">Review before placing your order.</p>

    <div className="cf-ship-info">
      <p className="cf-ship-label">Delivering to</p>
      <p className="cf-ship-name">{form.name}</p>
      <p className="cf-ship-addr">{form.address}</p>
    </div>

    <div className="cf-items">
      {items.map(item => (
        <div key={item.cartId} className="cf-item">
          <img src={item.image} alt={item.name} className="cf-item-img" />
          <div className="cf-item-info">
            <h4>{item.name}</h4>
            <p>{item.selectedColor} · {item.selectedSize} · Qty {item.quantity}</p>
          </div>
          <span className="cf-item-price">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
    </div>

    <div className="cf-totals">
      <div className="cf-total-row"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
      <div className="cf-total-row"><span>Shipping</span><span>Free</span></div>
      <div className="cf-total-row grand"><span>Total</span><span>${total.toFixed(2)}</span></div>
    </div>
  </div>
);

// ─── Step 3: Confirmed ────────────────────────────────────────────────────────
const StepConfirmed = ({ orderId, form, total, waLink, onDone }) => (
  <div className="cf-step-content cf-confirm">
    <motion.div
      className="cf-confirm-icon"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <CheckCircle size={52} strokeWidth={1.2} />
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
      <h2 className="cf-title">Order Confirmed!</h2>
      <p className="cf-subtitle">
        Thank you, {form.name.split(' ')[0]}. Your order is on its way.
      </p>
    </motion.div>

    <motion.div
      className="cf-confirm-details"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
    >
      {[
        ['Order ID',   `#${orderId}`],
        ['Email',      form.email  ],
        ['Order Total',`$${total.toFixed(2)}`],
        ['Shipping',   'Free'      ],
      ].map(([label, val]) => (
        <div key={label} className="cf-detail-row">
          <span>{label}</span>
          <span>{val}</span>
        </div>
      ))}
    </motion.div>

    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
      <motion.button
        className="btn-secondary"
        style={{ flex: 1 }}
        onClick={onDone}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Close
      </motion.button>
      <motion.button
        className="btn-primary"
        style={{ flex: 1, backgroundColor: '#25D366', borderColor: '#25D366', color: '#fff' }}
        onClick={() => redirectToWhatsApp(waLink)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Confirm on WhatsApp
      </motion.button>
    </div>
  </div>
);

// ─── Reusable text field ──────────────────────────────────────────────────────
const Field = ({ label, name, type, placeholder, value, onChange, error }) => (
  <div className="input-group">
    <label>{label}</label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={name}
      className={error ? 'input-error' : ''}
    />
    {error && (
      <span className="error-msg">
        <AlertCircle size={12} /> {error}
      </span>
    )}
  </div>
);

export default CheckoutFlow;
