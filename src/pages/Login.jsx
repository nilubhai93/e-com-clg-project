import { useState, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role');

  const getPageInfo = () => {
    switch (role) {
      case 'admin':
        return {
          title: 'Admin Portal',
          subtitle: 'Secure Management Access',
          iconColor: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
          logoChar: 'A'
        };
      case 'delivery':
        return {
          title: 'Delivery Hub',
          subtitle: 'Partner Logistics Entry',
          iconColor: 'linear-gradient(135deg, #0cebeb 0%, #29ffc6 100%)',
          logoChar: 'D'
        };
      default:
        return {
          title: 'Welcome Back',
          subtitle: 'Sign in to your FlashFit account',
          iconColor: 'var(--gradient-primary)',
          logoChar: 'F'
        };
    }
  };

  const pageInfo = getPageInfo();

  const handleClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleBackdropClick = useCallback((e) => {
    // Close only if the click is on the backdrop itself, not inside the card
    if (cardRef.current && !cardRef.current.contains(e.target)) {
      handleClose();
    }
  }, [handleClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else if (result.user.role === 'delivery') {
        navigate('/delivery');
      } else {
        navigate('/shop');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 18px', borderRadius: 'var(--radius-md)',
    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
    transition: 'border var(--transition-fast)'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={handleBackdropClick}
      style={{
        minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
        background: 'radial-gradient(ellipse at 50% 30%, rgba(168,85,247,0.08) 0%, transparent 60%)',
        cursor: 'pointer'
      }}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          width: '100%', maxWidth: '440px',
          padding: '48px 40px', borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          cursor: 'default'
        }}>

        {/* Close button */}
        <motion.button
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClose}
          aria-label="Close login"
          style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(8px)',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
            e.currentTarget.style.color = '#f87171';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </motion.button>

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: pageInfo.iconColor, margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: 800, color: 'white'
          }}>{pageInfo.logoChar}</div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>{pageInfo.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{pageInfo.subtitle}</p>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 'var(--radius-md)',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            color: 'var(--error)', fontSize: '13px', marginBottom: '20px'
          }}>{error}</div>
        )}

        {/* Demo credentials hint */}
        <div style={{
          padding: '12px 16px', borderRadius: 'var(--radius-md)',
          background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)',
          fontSize: '12px', color: 'var(--accent-light)', marginBottom: '20px'
        }}>
          <strong>Demo:</strong> demo@fashion.app / demo123456
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ ...inputStyle, paddingRight: '48px' }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                {showPw ? <VisibilityOffIcon sx={{ fontSize: 20 }} /> : <VisibilityIcon sx={{ fontSize: 20 }} />}
              </button>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
            style={{
              width: '100%', padding: '16px', borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-primary)', color: 'white',
              fontSize: '15px', fontWeight: 700, marginTop: '8px',
              opacity: loading ? 0.7 : 1, boxShadow: '0 4px 20px var(--accent-glow)'
            }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Create one</Link>
        </p>
      </motion.div>
    </motion.div>
  );
}

