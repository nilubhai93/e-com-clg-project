import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ElectricBikeIcon from '@mui/icons-material/ElectricBike';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const roles = [
  {
    id: 'admin',
    title: 'Retail Admin',
    description: 'Manage inventory, approve sellers, and monitor platform growth.',
    icon: AdminPanelSettingsIcon,
    color: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    path: '/login?role=admin',
    accent: '#FF6B6B'
  },
  {
    id: 'user',
    title: 'Fashion User',
    description: 'Discover the latest trends, shop premium collections, and style your life.',
    icon: ShoppingBagIcon,
    color: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    path: '/shop',
    accent: '#a855f7'
  },
  {
    id: 'delivery',
    title: 'Logistics Delivery',
    description: 'Fulfill orders, track routes, and ensure lightning-fast deliveries.',
    icon: ElectricBikeIcon,
    color: 'linear-gradient(135deg, #0cebeb 0%, #20e3b2 0%, #29ffc6 100%)',
    path: '/login?role=delivery',
    accent: '#20e3b2'
  }
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      color: '#fff',
      fontFamily: 'var(--font-display)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background Glows */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '60px', zIndex: 1 }}
      >
        <h1 style={{
          fontSize: 'clamp(40px, 8vw, 72px)',
          fontWeight: 900,
          background: 'linear-gradient(to bottom, #fff 0%, #aaa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px',
          letterSpacing: '-2px'
        }}>
          FlashFit Ecosystem
        </h1>
        <p style={{
          fontSize: '18px',
          color: 'rgba(255,255,255,0.6)',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Select your portal to enter the future of fashion commerce. 
          Tailored experiences for every role in the fashion cycle.
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        width: '100%',
        maxWidth: '1200px',
        zIndex: 1
      }}>
        {roles.map((role, idx) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            whileHover={{ y: -10 }}
            onClick={() => navigate(role.path)}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              padding: '40px',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(12px)',
              transition: 'border-color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = role.accent;
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            }}
          >
            {/* Role Icon */}
            <div style={{
              width: '64px',
              height: '64px',
              background: role.color,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '32px',
              boxShadow: `0 10px 30px ${role.accent}44`
            }}>
              <role.icon sx={{ fontSize: 32, color: '#fff' }} />
            </div>

            <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>
              {role.title}
            </h2>
            <p style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.6,
              marginBottom: '32px'
            }}>
              {role.description}
            </p>

            <motion.div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: role.accent,
                fontWeight: 700,
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Enter Portal <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </motion.div>

            {/* Subtle Gradient Hover Effect */}
            <div style={{
              position: 'absolute',
              bottom: '-20%',
              right: '-20%',
              width: '50%',
              height: '50%',
              background: role.color,
              filter: 'blur(80px)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              zIndex: -1
            }} className="role-glow" />
          </motion.div>
        ))}
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        style={{
          marginTop: '80px',
          padding: '20px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          width: '100%',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}
      >
        © 2026 FlashFit Premium Logistics & Fashion Ecosystem
      </motion.footer>

      <style>{`
        .role-glow { opacity: 0.1 !important; }
        @media (max-width: 768px) {
          h1 { font-size: 40px !important; }
        }
      `}</style>
    </div>
  );
}
