import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';
import { sendOrderEmail } from '../services/emailService';
import './CheckoutModal.scss';

const CheckoutModal = ({ onClose, onSuccess, directProduct = null }) => {
  const savedProfile = getStorageItem(STORAGE_KEYS.PROFILE, {
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const cartItems = getStorageItem(STORAGE_KEYS.CART, []);

  const [formData, setFormData] = useState({
    name: savedProfile.name || '',
    email: savedProfile.email || '',
    phone: savedProfile.phone || '',
    address: savedProfile.address || '',
  });

  const [errors, setErrors] = useState({});
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear individual field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim())    newErrors.name    = 'Full name is required.';
    if (!formData.email.trim())   newErrors.email   = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
                                  newErrors.email   = 'Enter a valid email address.';
    if (!formData.phone.trim())   newErrors.phone   = 'Phone number is required.';
    if (!formData.address.trim()) newErrors.address = 'Delivery address is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    // Build the exact payload that emailService expects
    const orderPayload = {
      name:          formData.name.trim(),
      email:         formData.email.trim(),
      phone:         formData.phone.trim(),
      address:       formData.address.trim(),
      items:         directProduct ? [] : cartItems,
      directProduct: directProduct ?? null,
    };

    try {
      const emailSent = await sendOrderEmail(orderPayload);

      if (emailSent) {
        if (saveToProfile) {
          setStorageItem(STORAGE_KEYS.PROFILE, {
            name: orderPayload.name,
            email: orderPayload.email,
            phone: orderPayload.phone,
            address: orderPayload.address,
          });
        }

        toast.success('Order confirmed! A confirmation email is on its way.', { duration: 4000 });

        setTimeout(() => {
          onSuccess(orderPayload);
        }, 1500);
      } else {
        toast.error('Email send failed. Check console for details.');
      }
    } catch (err) {
      console.error('[CheckoutModal] Unexpected error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <motion.div
        className="modal-container glass-panel"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="modal-header">
          <h3>Complete Your Order</h3>
          <button className="close-btn" onClick={onClose} disabled={loading} aria-label="Close modal">
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="checkout-form" noValidate>
          <Field
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            disabled={loading}
            placeholder="John Doe"
          />

          <Field
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            disabled={loading}
            placeholder="john@example.com"
          />

          <Field
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            error={errors.phone}
            disabled={loading}
            placeholder="+91 98765 43210"
          />

          <div className="input-group">
            <label>Delivery Address</label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="123, Street Name, City, State - PIN"
              className={errors.address ? 'input-error' : ''}
            />
            {errors.address && <span className="error-msg"><AlertCircle size={12} /> {errors.address}</span>}
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={saveToProfile}
                onChange={() => setSaveToProfile(!saveToProfile)}
                disabled={loading}
              />
              Save this info for next time
            </label>
          </div>

          <button type="submit" className="btn-primary submit-btn" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <Loader2 size={16} className="spinner" /> Processing…
              </span>
            ) : (
              <span className="btn-ready">
                <CheckCircle size={16} /> Confirm Order
              </span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

/** Reusable input field with inline error */
const Field = ({ label, name, type, value, onChange, error, disabled, placeholder }) => (
  <div className="input-group">
    <label>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={error ? 'input-error' : ''}
      autoComplete={name}
    />
    {error && <span className="error-msg"><AlertCircle size={12} /> {error}</span>}
  </div>
);

export default CheckoutModal;
