import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 18px', borderRadius: 'var(--radius-md)',
    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
      background: 'radial-gradient(ellipse at 50% 30%, rgba(236,72,153,0.08) 0%, transparent 60%)'
    }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%', maxWidth: '440px', padding: '48px 40px',
          borderRadius: 'var(--radius-xl)', background: 'var(--bg-card)',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)'
        }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'var(--gradient-primary)', margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: 800, color: 'white'
          }}>F</div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Join FlashFit and get styled by AI</p>
        </div>

        {error && <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--error)', fontSize: '13px', marginBottom: '20px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} style={inputStyle} />
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
            style={{
              width: '100%', padding: '16px', borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-primary)', color: 'white',
              fontSize: '15px', fontWeight: 700, marginTop: '8px',
              opacity: loading ? 0.7 : 1, boxShadow: '0 4px 20px var(--accent-glow)'
            }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
