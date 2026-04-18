import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';
import './Profile.scss';
import { Package } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setProfile(getStorageItem(STORAGE_KEYS.PROFILE, { name: '', email: '', phone: '', address: '' }));
    setOrders(getStorageItem(STORAGE_KEYS.ORDERS, []));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setStorageItem(STORAGE_KEYS.PROFILE, profile);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <motion.div 
      className="page-transition profile-page container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-layout">
        <div className="profile-info glass-panel">
          <div className="profile-header">
            <h2>Personal Information</h2>
            <button className="btn-secondary" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit Info'}
            </button>
          </div>

          <form onSubmit={handleSave} className="profile-form">
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={profile.name} 
                onChange={handleChange} 
                disabled={!isEditing} 
                required 
              />
            </div>
            
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={profile.email} 
                onChange={handleChange} 
                disabled={!isEditing} 
                required 
              />
            </div>
            
            <div className="input-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                value={profile.phone} 
                onChange={handleChange} 
                disabled={!isEditing} 
                required 
              />
            </div>
            
            <div className="input-group">
              <label>Shipping Address</label>
              <textarea 
                name="address" 
                rows="3" 
                value={profile.address} 
                onChange={handleChange} 
                disabled={!isEditing} 
                required 
              />
            </div>

            {isEditing && (
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Save Changes
              </button>
            )}
          </form>
        </div>

        <div className="profile-orders glass-panel">
          <div className="profile-header">
            <h2>Order History</h2>
          </div>
          
          {orders.length === 0 ? (
            <div className="no-orders text-center" style={{ padding: '2rem' }}>
              <Package size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-secondary)' }}>You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.slice().reverse().map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
                      <span className="order-id">#{order.id}</span>
                    </div>
                    <span className="order-total">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="order-items">
                    {order.items.map((item, i) => (
                      <span key={i} className="order-item-chip">{item.name} x {item.quantity}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
