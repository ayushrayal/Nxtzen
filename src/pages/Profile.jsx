import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';
import './Profile.scss';

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '' });
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setProfile(getStorageItem(STORAGE_KEYS.PROFILE, { name: '', email: '', phone: '', address: '' }));
    setOrders(getStorageItem(STORAGE_KEYS.ORDERS, []));
  }, []);

  const handleChange = e => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = e => {
    e.preventDefault();
    setStorageItem(STORAGE_KEYS.PROFILE, profile);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <motion.div
      className="page-transition profile-page container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="page-title">My Account</h1>

      <div className="profile-layout">
        {/* Personal Info */}
        <div className="profile-info">
          <div className="profile-header">
            <h2>Personal Information</h2>
            <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
              onClick={() => setIsEditing(prev => !prev)}>
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <form onSubmit={handleSave} className="profile-form">
            {[
              { label: 'Full Name',        name: 'name',    type: 'text',  placeholder: 'John Doe'            },
              { label: 'Email Address',    name: 'email',   type: 'email', placeholder: 'john@example.com'    },
              { label: 'Phone Number',     name: 'phone',   type: 'tel',   placeholder: '+1 555 012 3456'     },
            ].map(f => (
              <div className="input-group" key={f.name}>
                <label>{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  value={profile[f.name]}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder={f.placeholder}
                />
              </div>
            ))}

            <div className="input-group">
              <label>Shipping Address</label>
              <textarea
                name="address"
                rows="3"
                value={profile.address}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="123, Street Name, City, State"
              />
            </div>

            {isEditing && (
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Save Changes
              </button>
            )}
          </form>
        </div>

        {/* Order History */}
        <div className="profile-orders">
          <div className="profile-header">
            <h2>Order History</h2>
          </div>

          {orders.length === 0 ? (
            <div className="no-orders">
              <Package size={40} />
              <p>No orders placed yet.</p>
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
                      <span key={i} className="order-item-chip">{item.name} × {item.quantity}</span>
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
