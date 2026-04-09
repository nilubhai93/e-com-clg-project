import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import StraightenIcon from '@mui/icons-material/Straighten';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

export default function Profile() {
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    topSize: user?.sizeProfile?.topSize || '',
    bottomSize: user?.sizeProfile?.bottomSize || '',
    shoeSize: user?.sizeProfile?.shoeSize || ''
  });

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px' }}>Please sign in</h2>
        <Link to="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await updateProfile({
        name: form.name, phone: form.phone,
        sizeProfile: { topSize: form.topSize, bottomSize: form.bottomSize, shoeSize: form.shoeSize, preferredBrands: user?.sizeProfile?.preferredBrands || {} }
      });
      setEditing(false);
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)',
    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
  };

  return (
    <div className="container" style={{ padding: '32px 24px 60px', maxWidth: '700px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '32px' }}>Profile</h1>

      {/* User Info Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ padding: '32px', borderRadius: 'var(--radius-xl)', background: 'var(--bg-card)', border: '1px solid var(--border)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: 800, color: 'white'
          }}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700 }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{user?.email}</p>
          </div>
          <button onClick={() => setEditing(!editing)} style={{
            marginLeft: 'auto', padding: '8px 20px', borderRadius: 'var(--radius-md)',
            background: 'var(--accent-bg)', color: 'var(--accent-light)',
            fontSize: '13px', fontWeight: 600, border: '1px solid rgba(168,85,247,0.2)'
          }}>{editing ? 'Cancel' : 'Edit'}</button>
        </div>

        {editing ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Phone</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91-XXXXXXXXXX" style={inputStyle} />
            </div>
            <motion.button whileTap={{ scale: 0.98 }} onClick={handleSave} className="btn btn-primary" style={{ gridColumn: 'span 2', marginTop: '8px' }}>Save Changes</motion.button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <InfoItem icon={<PersonOutlineIcon sx={{ fontSize: 18 }} />} label="Phone" value={user?.phone || 'Not set'} />
            <InfoItem icon={<LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />} label="Default Address" value={user?.addresses?.[0] ? `${user.addresses[0].city}, ${user.addresses[0].zip}` : 'Not set'} />
          </div>
        )}
      </motion.div>

      {/* Size Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ padding: '32px', borderRadius: 'var(--radius-xl)', background: 'var(--bg-card)', border: '1px solid var(--border)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <StraightenIcon sx={{ color: 'var(--accent-light)' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Size Profile — <span className="gradient-text">Smart Fit</span></h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
          Tell us your sizes and preferred brands. Our AI will recommend the perfect fit every time.
        </p>

        {editing ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Top Size</label>
              <input value={form.topSize} onChange={e => setForm({...form, topSize: e.target.value})} placeholder="M" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Bottom Size</label>
              <input value={form.bottomSize} onChange={e => setForm({...form, bottomSize: e.target.value})} placeholder="32" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Shoe Size</label>
              <input value={form.shoeSize} onChange={e => setForm({...form, shoeSize: e.target.value})} placeholder="9" style={inputStyle} />
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <SizeChip label="Top" value={user?.sizeProfile?.topSize || '—'} />
            <SizeChip label="Bottom" value={user?.sizeProfile?.bottomSize || '—'} />
            <SizeChip label="Shoe" value={user?.sizeProfile?.shoeSize || '—'} />
          </div>
        )}

        {user?.sizeProfile?.preferredBrands && Object.keys(user.sizeProfile.preferredBrands).length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Preferred Brand Sizes:</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.entries(user.sizeProfile.preferredBrands).map(([brand, size]) => (
                <span key={brand} style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-primary)' }}>
                  {brand}: {size}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Link to="/orders" style={{
          padding: '20px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '1px solid var(--border)',
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all var(--transition-fast)'
        }}>
          <ShoppingBagOutlinedIcon sx={{ color: 'var(--accent-light)' }} />
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>My Orders</span>
        </Link>
        <button onClick={handleLogout} style={{
          padding: '20px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', width: '100%', textAlign: 'left'
        }}>
          <LogoutIcon sx={{ color: 'var(--error)' }} />
          <span style={{ color: 'var(--error)', fontWeight: 600 }}>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)' }}>
      <span style={{ color: 'var(--accent-light)' }}>{icon}</span>
      <div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
      </div>
    </div>
  );
}

function SizeChip({ label, value }) {
  return (
    <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', textAlign: 'center' }}>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '20px', fontWeight: 800 }} className="gradient-text">{value}</div>
    </div>
  );
}
