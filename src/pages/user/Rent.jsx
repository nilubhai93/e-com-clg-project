import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EventIcon from '@mui/icons-material/Event';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import DryCleaningOutlinedIcon from '@mui/icons-material/DryCleaningOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';

const upcomingFeatures = [
  {
    id: 1,
    icon: <DryCleaningOutlinedIcon sx={{ fontSize: 28 }} />,
    title: 'Designer Outfit Rentals',
    description: 'Rent premium designer outfits for weddings, parties, and special occasions at a fraction of the retail price.',
    status: 'in-progress',
    eta: 'June 2026',
    color: '#a855f7',
  },
  {
    id: 2,
    icon: <CameraAltOutlinedIcon sx={{ fontSize: 28 }} />,
    title: 'Virtual Try-On for Rentals',
    description: 'See how rental outfits look on you using AR technology before you commit to renting.',
    status: 'planned',
    eta: 'July 2026',
    color: '#ec4899',
  },
  {
    id: 3,
    icon: <EventIcon sx={{ fontSize: 28 }} />,
    title: 'Occasion-Based Collections',
    description: 'Curated rental collections for every occasion — wedding guest, cocktail party, prom, and more.',
    status: 'in-progress',
    eta: 'June 2026',
    color: '#f59e0b',
  },
  {
    id: 4,
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 28 }} />,
    title: 'Free Delivery & Returns',
    description: 'Get your rented outfit delivered free within 20 minutes and return it hassle-free after your event.',
    status: 'planned',
    eta: 'August 2026',
    color: '#22c55e',
  },
  {
    id: 5,
    icon: <SavingsOutlinedIcon sx={{ fontSize: 28 }} />,
    title: 'Subscription Plans',
    description: 'Monthly rental subscriptions — get 3-5 outfits per month for a flat fee. Perfect for fashion enthusiasts.',
    status: 'exploring',
    eta: 'Q4 2026',
    color: '#3b82f6',
  },
  {
    id: 6,
    icon: <TimerOutlinedIcon sx={{ fontSize: 28 }} />,
    title: 'Flexible Rental Periods',
    description: 'Choose rental durations from 1-day flash rentals to 30-day extended wear. You decide how long.',
    status: 'planned',
    eta: 'July 2026',
    color: '#06b6d4',
  },
  {
    id: 7,
    icon: <VerifiedOutlinedIcon sx={{ fontSize: 28 }} />,
    title: 'Certified Clean Guarantee',
    description: 'Every rented garment is professionally dry-cleaned, sanitized, and quality-inspected before shipment.',
    status: 'in-progress',
    eta: 'June 2026',
    color: '#10b981',
  },
  {
    id: 8,
    icon: <AutoAwesomeIcon sx={{ fontSize: 28 }} />,
    title: 'AI Style Match for Events',
    description: 'Tell our AI about your event and get perfectly matched rental outfit suggestions tailored to your profile.',
    status: 'exploring',
    eta: 'Q4 2026',
    color: '#8b5cf6',
  },
];

const statusConfig = {
  'in-progress': { label: 'In Progress', bg: 'rgba(168,85,247,0.12)', color: '#c084fc', border: 'rgba(168,85,247,0.25)' },
  'planned': { label: 'Planned', bg: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
  'exploring': { label: 'Exploring', bg: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: 'rgba(245,158,11,0.2)' },
};

export default function Rent() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleWaitlist = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setEmail('');
    }
  };

  const filteredFeatures = activeFilter === 'all'
    ? upcomingFeatures
    : upcomingFeatures.filter(f => f.status === activeFilter);

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      background: 'radial-gradient(ellipse at 30% 10%, rgba(168,85,247,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(236,72,153,0.04) 0%, transparent 50%)',
    }}>
      {/* Hero Section */}
      <div style={{
        maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 40px',
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 20px', borderRadius: '50px',
            background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(236,72,153,0.08))',
            border: '1px solid rgba(168,85,247,0.2)',
            marginBottom: '24px',
          }}>
            <DiamondOutlinedIcon sx={{ fontSize: 18, color: '#c084fc' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#e9d5ff', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Coming Soon
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            lineHeight: 1.1,
            marginBottom: '20px',
            marginTop:'100px',
          }}>
            FlashFit{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Rent</span>
          </h1>

          <p style={{
            fontSize: '18px', color: 'var(--text-secondary)',
            maxWidth: '600px', margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            Premium designer fashion, delivered to your door. Wear once, return, repeat. 
            Experience luxury without the commitment.
          </p>

          {/* Waitlist Form */}
          <motion.form
            onSubmit={handleWaitlist}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              display: 'flex', gap: '12px',
              maxWidth: '460px', margin: '0 auto',
              flexWrap: 'wrap', justifyContent: 'center',
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for early access"
              required
              style={{
                flex: '1 1 260px', padding: '16px 24px',
                borderRadius: '50px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontSize: '14px', outline: 'none',
                transition: 'border 0.3s ease',
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(168,85,247,0.4)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              style={{
                padding: '16px 32px', borderRadius: '50px',
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                color: 'white', fontSize: '14px', fontWeight: 700,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(168,85,247,0.3)',
                whiteSpace: 'nowrap',
              }}
            >
              Join Waitlist →
            </motion.button>
          </motion.form>

          {/* Success toast */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  marginTop: '16px', padding: '10px 20px',
                  borderRadius: '50px',
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  color: '#4ade80', fontSize: '13px', fontWeight: 600,
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />
                You're on the waitlist! We'll notify you first.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          maxWidth: '800px', margin: '0 auto 48px', padding: '0 24px',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px',
        }}
      >
        {[
          { value: '500+', label: 'Designer Outfits', icon: '👗' },
          { value: '₹299', label: 'Starting Price', icon: '💰' },
          { value: '20 min', label: 'Flash Delivery', icon: '⚡' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            style={{
              padding: '24px 16px', borderRadius: '16px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Features Section */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{
            fontSize: '28px', fontWeight: 700,
            fontFamily: 'var(--font-display)', marginBottom: '12px',
          }}>
            Upcoming Features
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '500px', margin: '0 auto 24px' }}>
            Here's what we're building to make fashion rental seamless
          </p>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'All' },
              { key: 'in-progress', label: '🔨 In Progress' },
              { key: 'planned', label: '📋 Planned' },
              { key: 'exploring', label: '🔍 Exploring' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  padding: '8px 18px', borderRadius: '50px',
                  fontSize: '12px', fontWeight: 600,
                  background: activeFilter === f.key
                    ? 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.1))'
                    : 'var(--bg-card)',
                  color: activeFilter === f.key ? '#e9d5ff' : 'var(--text-muted)',
                  border: `1px solid ${activeFilter === f.key ? 'rgba(168,85,247,0.3)' : 'var(--border)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredFeatures.map((feature, i) => {
              const status = statusConfig[feature.status];
              return (
                <motion.div
                  key={feature.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  whileHover={{ y: -4, boxShadow: `0 12px 40px ${feature.color}15` }}
                  style={{
                    padding: '28px',
                    borderRadius: '20px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    cursor: 'default',
                    transition: 'box-shadow 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Top glow */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                    background: `linear-gradient(90deg, transparent, ${feature.color}60, transparent)`,
                  }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    {/* Icon */}
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px',
                      background: `${feature.color}15`,
                      border: `1px solid ${feature.color}25`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: feature.color,
                    }}>
                      {feature.icon}
                    </div>

                    {/* Status Badge */}
                    <span style={{
                      padding: '4px 12px', borderRadius: '50px',
                      background: status.bg, color: status.color,
                      border: `1px solid ${status.border}`,
                      fontSize: '10px', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>
                      {status.label}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '17px', fontWeight: 700,
                    color: 'var(--text-primary)', marginBottom: '8px',
                  }}>
                    {feature.title}
                  </h3>

                  <p style={{
                    fontSize: '13px', color: 'var(--text-muted)',
                    lineHeight: 1.7, marginBottom: '16px',
                  }}>
                    {feature.description}
                  </p>

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600,
                  }}>
                    <TimerOutlinedIcon sx={{ fontSize: 14, color: feature.color }} />
                    ETA: {feature.eta}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        padding: '60px 24px',
        background: 'linear-gradient(180deg, transparent, rgba(168,85,247,0.04))',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: '600px', margin: '0 auto' }}
        >
          <h3 style={{
            fontSize: '24px', fontWeight: 700,
            fontFamily: 'var(--font-display)', marginBottom: '12px',
          }}>
            Got a Feature Idea?
          </h3>
          <p style={{
            color: 'var(--text-muted)', fontSize: '14px',
            marginBottom: '24px', lineHeight: 1.7,
          }}>
            We're building FlashFit Rent for you. Tell us what features matter most 
            and help shape the future of fashion rental.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => window.open('mailto:feedback@flashfit.app?subject=Rent Feature Suggestion', '_blank')}
            style={{
              padding: '14px 32px', borderRadius: '50px',
              background: 'transparent',
              border: '1px solid rgba(168,85,247,0.3)',
              color: '#c084fc', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(168,85,247,0.1)';
              e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)';
            }}
          >
            Share Your Ideas ✨
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
