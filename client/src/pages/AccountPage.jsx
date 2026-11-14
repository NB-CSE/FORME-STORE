import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AccountPage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    country: user?.address?.country || 'India'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country
        }
      };
      const { data } = await authAPI.updateProfile(payload);
      if (data.success) {
        updateUser(data.user);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { marginBottom: 'var(--space-md)' };
  const labelStyle = { display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-xs)', color: 'var(--color-text-secondary)' };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 'var(--space-2xl) var(--space-lg) var(--space-4xl)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--font-size-3xl)', fontWeight: 500, marginBottom: 'var(--space-xs)' }}>My Account</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2xl)' }}>Manage your personal details and default shipping address</p>

      <div style={{ backgroundColor: 'var(--color-white)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-2xl)' }}>
        <form onSubmit={handleSubmit}>
          <div style={inputStyle}>
            <label style={labelStyle}>Email Address (Read-only)</label>
            <input type="email" value={user?.email || ''} disabled style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-light)' }} />
          </div>

          <div style={inputStyle}>
            <label style={labelStyle}>Full Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>

          <div style={inputStyle}>
            <label style={labelStyle}>Phone Number</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>

          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, margin: 'var(--space-xl) 0 var(--space-md)' }}>Default Address</h3>

          <div style={inputStyle}>
            <label style={labelStyle}>Street Address</label>
            <input type="text" value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div style={inputStyle}>
              <label style={labelStyle}>City</label>
              <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
            </div>
            <div style={inputStyle}>
              <label style={labelStyle}>State</label>
              <input type="text" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div style={inputStyle}>
              <label style={labelStyle}>Pincode</label>
              <input type="text" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} />
            </div>
            <div style={inputStyle}>
              <label style={labelStyle}>Country</label>
              <input type="text" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-lg)' }} disabled={loading}>
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;

