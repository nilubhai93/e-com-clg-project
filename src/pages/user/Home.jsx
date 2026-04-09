import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productAPI } from '../../api';
import ProductCard from '../../components/ProductCard';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [featRes, dealRes, catRes] = await Promise.all([
          productAPI.getFeatured(),
          productAPI.getDeals(),
          productAPI.getCategories()
        ]);
        setFeatured(featRes.data.products || []);
        setDeals(dealRes.data.products || []);
        setCategories(catRes.data.categories || []);
      } catch (e) {
        console.error('Failed to load home data:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categoryIcons = {
    dress: '👗', shirt: '👔', jeans: '👖', tshirt: '👕',
    jacket: '🧥', shoes: '👟', bag: '👜', jewelry: '💎',
    accessory: '⌚', skirt: '🩱', shorts: '🩳', sweater: '🧶',
    outerwear: '🧥'
  };

  const features = [
    { icon: <LocalShippingOutlinedIcon />, title: '10-30 Min Delivery', desc: 'Lightning fast to your doorstep' },
    { icon: <AutoAwesomeIcon />, title: 'AI Personal Stylist', desc: 'Smart outfit recommendations' },
    { icon: <AccessTimeIcon />, title: 'Real-time Tracking', desc: 'Know exactly when it arrives' },
    { icon: <VerifiedIcon />, title: '100% Authentic', desc: 'Guaranteed genuine brands' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section" style={{
        position: 'relative',
        display: 'flex', alignItems: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 30% 50%, rgba(168, 85, 247, 0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)'
      }}>
        {/* Animated grid bg */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="container hero-grid " style={{
          alignItems: 'center', position: 'relative', zIndex: 1
        }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-badge"  style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-bg)', border: '1px solid rgba(168, 85, 247, 0.2)',
              color: 'var(--accent-light)', fontWeight: 600, 
            }}>
              <TrendingUpIcon sx={{ fontSize: 16 }} />
              AI-Powered Quick Commerce
            </div>

            <h1 className="hero-title" style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              lineHeight: 1.1,
              color: 'var(--text-primary)'
            }}>
              Your Style,{' '}
              <span className="gradient-text">Delivered in Minutes</span>
            </h1>

            <p className="hero-description" style={{
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
            }}>
              Tell our AI stylist about your occasion — it'll find the perfect outfit and deliver it before you can say "what should I wear?"
            </p>

            <div className="hero-cta-group" style={{ display: 'flex', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn btn-primary hero-cta-btn" style={{
                borderRadius: 'var(--radius-full)'
              }}>
                Shop Now <ArrowForwardIcon sx={{ fontSize: 18 }} />
              </Link>
              <button
                onClick={() => document.getElementById('ai-stylist-fab')?.click()}
                className="btn btn-outline hero-cta-btn"
                style={{
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 18 }} />
                Try AI Stylist
              </button>
            </div>

            {/* Stats */}
            <div className="hero-stats" style={{
              display: 'flex',
            }}>
              {[
                { value: '10K+', label: 'Products' },
                { value: '20 min', label: 'Avg Delivery' },
                { value: '4.8★', label: 'Rating' }
              ].map(stat => (
                <div key={stat.label}>
                  <div className="stat-value" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</div>
                  <div className="stat-label" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero Right — Fashion Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
              maxHeight: '550px'
            }}
            className="desktop-only"
          >
            {[
            
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&h=300&fit=crop',
              'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&h=400&fit=crop'
            ].map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  gridRow: i % 2 === 0 ? 'span 2' : 'span 1',
                  border: '1px solid var(--border)'
                }}
              >
                <img src={img} alt="" style={{
                  width: '100%', height: '100%', objectFit: 'cover'
                }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="features-bar" style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)'
      }}>
        <div className="container features-grid">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="feature-item"
            >
              <div className="feature-icon" style={{
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent-light)', flexShrink: 0
              }}>{f.icon}</div>
              <div>
                <div className="feature-title" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{f.title}</div>
                <div className="feature-desc" style={{ color: 'var(--text-muted)' }}>{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title" style={{
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
              }}>Shop by Category</h2>
              <p className="section-subtitle" style={{ color: 'var(--text-muted)' }}>Find exactly what you're looking for</p>
            </div>
            <Link to="/products" className="btn btn-ghost" style={{ color: 'var(--accent-light)', whiteSpace: 'nowrap' }}>
              View All <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </Link>
          </div>

          <div className="categories-scroll-wrapper">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{
                  flex: '0 0 auto',
                  scrollSnapAlign: 'start',
                }}
              >
                <Link to={`/products?category=${cat.name}`} className="category-card" style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  textDecoration: 'none', transition: 'all var(--transition-base)',
                }}>
                  <span className="category-emoji">{categoryIcons[cat.name] || '🏷️'}</span>
                  <span className="category-name" style={{
                    fontWeight: 600, color: 'var(--text-primary)',
                    textTransform: 'capitalize', textAlign: 'center', whiteSpace: 'nowrap'
                  }}>{cat.name}</span>
                  <span className="category-count" style={{
                    color: 'var(--text-muted)'
                  }}>{cat.count} items</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title" style={{
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
              }}>
                <span className="gradient-text">Trending</span> Now
              </h2>
              <p className="section-subtitle" style={{ color: 'var(--text-muted)' }}>Top-rated picks our stylists love</p>
            </div>
            <Link to="/products" className="btn btn-ghost" style={{ color: 'var(--accent-light)' }}>
              Shop All <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </Link>
          </div>

          {loading ? (
            <div className="product-grid">
              {[1,2,3,4].map(i => (
                <div key={i} className="skeleton" style={{ height: '420px' }} />
              ))}
            </div>
          ) : (
            <div className="product-grid">
              {featured.slice(0, 8).map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Feature Banner */}
      <section className="ai-banner-section" style={{
        background: 'linear-gradient(180deg, transparent, rgba(168, 85, 247, 0.05), transparent)'
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="ai-banner-card"
            style={{
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.08))',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 14px', borderRadius: 'var(--radius-full)',
                background: 'var(--accent-bg)', marginBottom: '20px',
                fontSize: '12px', fontWeight: 700, color: 'var(--accent-light)',
                textTransform: 'uppercase', letterSpacing: '1px'
              }}>
                <AutoAwesomeIcon sx={{ fontSize: 14 }} /> AI-Powered
              </div>

              <h2 className="ai-banner-title" style={{
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                lineHeight: 1.2
              }}>
                "I have a wedding in 2 hours, what should I wear?"
              </h2>
              <p className="ai-banner-desc" style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
              }}>
                Our AI understands context — occasion, weather, urgency, budget, and your personal style. 
                It finds the perfect outfit and ensures it arrives before your event.
              </p>

              <div className="ai-features-list" style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { title: 'Occasion-First Search', desc: 'Describe your event, get perfect outfits', icon: '🎯' },
                  { title: 'Smart Fit Technology', desc: 'Tell us your brand sizes, we match perfectly', icon: '📏' },
                  { title: 'Flash-Bundle Deals', desc: 'AI-curated bundles with 15% discount', icon: '⚡' }
                ].map(f => (
                  <div key={f.title} className="ai-feature-item" style={{
                    display: 'flex', alignItems: 'center',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)'
                  }}>
                    <span className="ai-feature-emoji">{f.icon}</span>
                    <div>
                      <div className="ai-feature-title" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{f.title}</div>
                      <div className="ai-feature-desc" style={{ color: 'var(--text-muted)' }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ai-chat-preview" style={{
              display: 'flex', flexDirection: 'column',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)'
            }}>
              {[
                { role: 'user', text: "I'm going to a rooftop party, 18°C weather 🌙" },
                { role: 'ai', text: 'Perfect! For a rooftop party in mild weather, I recommend layering. Here are my top picks:' },
                { role: 'ai', text: '1. Italian Leather Bomber (₹9,999) — iconic layering piece\n2. Slim Fit Indigo Jeans (₹2,799)\n3. Sterling Silver Earrings (₹1,499)\n\n⚡ Bundle all three for 15% off — arrives in 20 min!' }
              ].map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.2 }}
                  className="chat-bubble"
                  style={{
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.role === 'user' ? 'var(--gradient-primary)' : 'var(--bg-card)',
                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '90%', lineHeight: 1.6,
                    whiteSpace: 'pre-line'
                  }}
                >{msg.text}</motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Deals */}
      {deals.length > 0 && (
        <section className="deals-section">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title" style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                  🔥 Flash Deals
                </h2>
                <p className="section-subtitle" style={{ color: 'var(--text-muted)' }}>Limited time offers you don't want to miss</p>
              </div>
            </div>
            <div className="product-grid">
              {deals.slice(0, 4).map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Occasion-First Quick Search */}
      <section className="occasions-section">
        <div className="container">
          <div style={{ textAlign: 'center' }} className="section-header section-header-centered">
            <div>
              <h2 className="section-title" style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                🎯 Shop by <span className="gradient-text">Occasion</span>
              </h2>
              <p className="section-subtitle" style={{ color: 'var(--text-muted)' }}>Tell us where you're going — we'll handle the rest</p>
            </div>
          </div>
          <div className="occasions-grid">
            {[
              { emoji: '💍', label: 'Wedding Guest', query: 'wedding' },
              { emoji: '🎉', label: 'Party Night', query: 'party' },
              { emoji: '💼', label: 'Office Wear', query: 'office' },
              { emoji: '🌹', label: 'Date Night', query: 'date' },
              { emoji: '☀️', label: 'Beach Day', query: 'beach' },
              { emoji: '🏋️', label: 'Gym / Sports', query: 'gym' },
              { emoji: '🎓', label: 'Graduation', query: 'graduation' },
              { emoji: '🎸', label: 'Festival', query: 'festival' },
            ].map((occ, i) => (
              <motion.div key={occ.query}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/products?occasion=${occ.query}`} className="occasion-card" style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  textDecoration: 'none',
                  transition: 'all var(--transition-base)'
                }}>
                  <span className="occasion-emoji">{occ.emoji}</span>
                  <span className="occasion-label" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {occ.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rent Teaser Section */}
      <section className="rent-teaser-section" style={{
        background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.06), transparent)'
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rent-card"
            style={{
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.08))',
              border: '1px solid rgba(99,102,241,0.2)',
              textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}
          >
            {/* Decorative circles */}
            <div style={{
              position: 'absolute', top: '-60px', right: '-60px',
              width: '200px', height: '200px', borderRadius: '50%',
              background: 'rgba(168,85,247,0.08)', filter: 'blur(40px)'
            }} />
            <div style={{
              position: 'absolute', bottom: '-40px', left: '-40px',
              width: '150px', height: '150px', borderRadius: '50%',
              background: 'rgba(99,102,241,0.08)', filter: 'blur(40px)'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px', borderRadius: 'var(--radius-full)',
                background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                marginBottom: '24px', fontSize: '12px', fontWeight: 700,
                color: 'var(--info)', textTransform: 'uppercase', letterSpacing: '1.5px'
              }}>
                ✨ Coming Soon
              </div>

              <h2 className="rent-title" style={{
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                lineHeight: 1.2
              }}>
                FlashFit <span className="gradient-text">Rent</span>
              </h2>
              <p className="rent-desc" style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.7, maxWidth: '600px', margin: '0 auto'
              }}>
                Rent designer outfits for special occasions. Premium fashion at a fraction of the price.
                Why buy when you can rent?
              </p>
              <p className="rent-price-hint" style={{
                color: 'var(--text-muted)',
              }}>
                Starting from ₹399/month • Free returns • Dry-cleaned & delivered
              </p>

              <div className="rent-cta-group" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="btn btn-primary rent-cta-btn"
                  onClick={() => alert("Added to waitlist! We'll notify you when FlashFit Rent goes live.")}
                  style={{
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  Join Waitlist →
                </motion.button>
                <Link to="/products?forRent=true" className="btn btn-outline rent-cta-btn"
                  style={{
                    borderRadius: 'var(--radius-full)'
                  }}>
                  Browse Rental Collection
                </Link>
              </div>

              {/* Social proof */}
              <div className="rent-stats" style={{
                display: 'flex', justifyContent: 'center',
              }}>
                {[
                  { value: '2,500+', label: 'Waitlisted' },
                  { value: '₹399', label: 'Starting Price' },
                  { value: '50+', label: 'Designer Brands' }
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="stat-value" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</div>
                    <div className="stat-label" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Responsive Styles ── */}
      <style>{`
        /* ══════ DESKTOP DEFAULTS ══════ */
        .hero-section { min-height: 85vh; }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
        }
        .hero-badge {
          padding: 6px 16px;
          margin-bottom: 24px;
          font-size: 13px;
        }
        .hero-title {
          font-size: clamp(36px, 5vw, 64px);
          margin-bottom: 24px;
        }
        .hero-description {
          font-size: 18px;
          margin-bottom: 36px;
          max-width: 500px;
        }
        .hero-cta-group { gap: 16px; }
        .hero-cta-btn { padding: 16px 32px; font-size: 15px; }
        .hero-stats { gap: 40px; margin-top: 48px; }
        .stat-value { font-size: 28px; }
        .stat-label { font-size: 13px; }

        /* Features */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .feature-item {
          padding: 28px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-right: 1px solid var(--border);
        }
        .feature-item:last-child { border-right: none; }
        .feature-icon { width: 48px; height: 48px; }
        .feature-title { font-size: 14px; }
        .feature-desc { font-size: 12px; }

        /* Sections */
        .categories-section { padding: 80px 0; }
        .featured-section { padding: 0 0 80px; }
        .ai-banner-section { padding: 80px 0; }
        .deals-section { padding: 0 0 80px; }
        .occasions-section { padding: 0 0 80px; }
        .rent-teaser-section { padding: 80px 0; }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        .section-header-centered {
          justify-content: center;
        }
        .section-title { font-size: clamp(24px, 4vw, 32px); margin-bottom: 8px; }
        .section-subtitle { font-size: clamp(13px, 2vw, 15px); }

        /* Categories */
        .categories-scroll-wrapper {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          padding-bottom: 16px;
          margin: 0 -24px;
          padding-left: 24px;
          padding-right: 24px;
        }
        .categories-scroll-wrapper::-webkit-scrollbar { height: 4px; }
        .categories-scroll-wrapper::-webkit-scrollbar-track { background: transparent; }
        .categories-scroll-wrapper::-webkit-scrollbar-thumb { background: var(--bg-elevated); border-radius: 4px; }
        .category-card {
          gap: 10px;
          padding: 20px 24px;
          min-width: 120px;
          width: 130px;
        }
        .category-card:hover {
          border-color: var(--accent) !important;
          background: var(--bg-elevated) !important;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(168, 85, 247, 0.15);
        }
        .category-emoji { font-size: 32px; line-height: 1; }
        .category-name { font-size: 13px; }
        .category-count { font-size: 11px; }

        /* Occasions */
        .occasions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }
        .occasion-card { gap: 12px; padding: 28px 16px; }
        .occasion-card:hover {
          border-color: var(--accent) !important;
          background: var(--bg-elevated) !important;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(168, 85, 247, 0.15);
        }
        .occasion-emoji { font-size: 36px; }
        .occasion-label { font-size: 13px; }

        /* AI Banner */
        .ai-banner-card {
          padding: 60px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
        }
        .ai-banner-title { font-size: 36px; margin-bottom: 16px; }
        .ai-banner-desc { font-size: 16px; margin-bottom: 32px; }
        .ai-features-list { gap: 16px; }
        .ai-feature-item { gap: 16px; padding: 16px; }
        .ai-feature-emoji { font-size: 24px; }
        .ai-feature-title { font-size: 14px; }
        .ai-feature-desc { font-size: 12px; }
        .ai-chat-preview { gap: 12px; padding: 24px; }
        .chat-bubble { padding: 14px 18px; font-size: 13px; }

        /* Rent */
        .rent-card { padding: 60px 48px; }
        .rent-title {
          font-size: clamp(28px, 4vw, 42px);
          margin-bottom: 16px;
        }
        .rent-desc { font-size: 17px; margin-bottom: 12px; }
        .rent-price-hint { font-size: 14px; margin-bottom: 36px; }
        .rent-cta-group { gap: 12px; }
        .rent-cta-btn { padding: 16px 36px; font-size: 15px; }
        .rent-stats { gap: 32px; margin-top: 40px; }

        /* ══════ LARGE TABLET (≤ 1024px) ══════ */
        @media (max-width: 1024px) {
          .hero-grid { gap: 40px; }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .feature-item:nth-child(2) { border-right: none; }
          .ai-banner-card { padding: 40px; gap: 32px; }
          .rent-card { padding: 48px 36px; }
          .occasions-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
          
        }

        /* ══════ TABLET (≤ 768px) ══════ */
        @media (max-width: 768px) {
          .hero-section { min-height: 65vh; }
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 32px;
          }
          .hero-badge { padding: 5px 12px; font-size: 12px; margin-bottom: 18px; }
          .hero-title { margin-bottom: 18px; }
          .hero-description { font-size: 15px; margin-bottom: 28px; max-width: 100%; }
          .hero-cta-group { gap: 12px; }
          .hero-cta-btn { padding: 12px 24px; font-size: 14px; }
          .hero-stats { gap: 28px; margin-top: 36px; }
          .stat-value { font-size: 24px; }
          .stat-label { font-size: 12px; }

          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .feature-item {
            padding: 20px 16px;
            gap: 12px;
          }
          .feature-item:nth-child(2) { border-right: none; }
          .feature-icon { width: 40px; height: 40px; }
          .feature-title { font-size: 13px; }
          .feature-desc { font-size: 11px; }

          .categories-section { padding: 48px 0; }
          .featured-section { padding: 0 0 48px; }
          .ai-banner-section { padding: 48px 0; }
          .deals-section { padding: 0 0 48px; }
          .occasions-section { padding: 0 0 48px; }
          .rent-teaser-section { padding: 48px 0; }

          .section-header { margin-bottom: 28px; }
          .section-title { margin-bottom: 6px; }

          .categories-scroll-wrapper {
            gap: 10px;
            margin: 0 -16px;
            padding-left: 16px;
            padding-right: 16px;
          }
          .category-card {
            padding: 18px 20px;
            min-width: 110px;
            width: 120px;
          }

          .occasions-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
          .occasion-card { padding: 20px 12px; gap: 10px; }
          .occasion-emoji { font-size: 30px; }
          .occasion-label { font-size: 12px; }

          .ai-banner-card {
            grid-template-columns: 1fr !important;
            padding: 32px !important;
            gap: 28px;
          }
          .ai-banner-title { font-size: 26px; }
          .ai-banner-desc { font-size: 14px; margin-bottom: 24px; }
          .ai-feature-item { padding: 12px; gap: 12px; }
          .ai-feature-emoji { font-size: 20px; }
          .ai-feature-title { font-size: 13px; }
          .ai-feature-desc { font-size: 11px; }
          .ai-chat-preview { padding: 16px; gap: 10px; }
          .chat-bubble { padding: 10px 14px; font-size: 12px; }

          .rent-card { padding: 36px 24px; }
          .rent-desc { font-size: 15px; }
          .rent-price-hint { font-size: 13px; margin-bottom: 28px; }
          .rent-cta-group { gap: 10px; }
          .rent-cta-btn { padding: 12px 24px; font-size: 14px; }
          .rent-stats { gap: 24px; margin-top: 32px; }
        }

        /* ══════ SMALL PHONE (≤ 480px) ══════ */
        @media (max-width: 480px) {
          .hero-section { min-height: 55vh; }
          .hero-badge { padding: 4px 10px; font-size: 11px; margin-bottom: 14px; }
          .hero-title { margin-bottom: 14px; }
          .hero-description { font-size: 14px; margin-bottom: 22px; line-height: 1.6; }
          .hero-cta-group { gap: 10px; }
          .hero-cta-btn { padding: 10px 20px; font-size: 13px; }
          .hero-stats { gap: 20px; margin-top: 28px; }
          .stat-value { font-size: 20px; }
          .stat-label { font-size: 11px; }

          .features-grid { grid-template-columns: 1fr !important; }
          .feature-item {
            padding: 16px 14px;
            gap: 12px;
            border-right: none !important;
            border-bottom: 1px solid var(--border);
          }
          .feature-item:last-child { border-bottom: none; }
          .feature-icon { width: 36px; height: 36px; }
          .feature-title { font-size: 12px; }
          .feature-desc { font-size: 11px; }

          .categories-section { padding: 36px 0; }
          .featured-section { padding: 0 0 36px; }
          .ai-banner-section { padding: 36px 0; }
          .deals-section { padding: 0 0 36px; }
          .occasions-section { padding: 0 0 36px; }
          .rent-teaser-section { padding: 36px 0; }

          .section-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 12px;
            margin-bottom: 20px;
          }
          .section-header-centered {
            align-items: center !important;
          }

          .categories-scroll-wrapper {
            gap: 8px;
            margin: 0 -12px;
            padding-left: 12px;
            padding-right: 12px;
            padding-bottom: 12px;
          }
          .category-card {
            padding: 14px 14px;
            min-width: 95px;
            width: 105px;
          }
          .category-emoji { font-size: 26px; }
          .category-name { font-size: 11px; }
          .category-count { font-size: 10px; }

          .occasions-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .occasion-card { padding: 18px 10px; gap: 8px; }
          .occasion-emoji { font-size: 26px; }
          .occasion-label { font-size: 11px; }

          .ai-banner-card { padding: 24px 16px !important; gap: 20px; }
          .ai-banner-title { font-size: 22px; margin-bottom: 12px; }
          .ai-banner-desc { font-size: 13px; margin-bottom: 18px; }
          .ai-features-list { gap: 10px; }
          .ai-feature-item { padding: 10px; gap: 10px; }
          .ai-feature-emoji { font-size: 18px; }
          .ai-feature-title { font-size: 12px; }
          .ai-feature-desc { font-size: 10px; }
          .ai-chat-preview { padding: 12px; gap: 8px; }
          .chat-bubble { padding: 8px 12px; font-size: 11px; }

          .rent-card { padding: 28px 16px; }
          .rent-title { margin-bottom: 12px; }
          .rent-desc { font-size: 14px; margin-bottom: 8px; }
          .rent-price-hint { font-size: 12px; margin-bottom: 24px; }
          .rent-cta-group { gap: 8px; }
          .rent-cta-btn { padding: 10px 20px; font-size: 13px; }
          .rent-stats { gap: 16px; margin-top: 28px; }
          .stat-value { font-size: 18px; }
          .stat-label { font-size: 10px; }
        }

        /* ══════ EXTRA SMALL (≤ 360px) ══════ */
        @media (max-width: 360px) {
          .hero-description { font-size: 15px; }
          .hero-cta-group { flex-direction: column; gap: 8px; }
          .hero-cta-btn { width: 100%; justify-content: center; }
          .hero-stats { gap: 16px; }
          .stat-value { font-size: 18px; }
          

          .category-card {
            padding: 12px 10x;
            min-width: 85px;
            width: 95px;
          }
          .category-emoji { font-size: 22px; }
          .category-name { font-size: 10px; }

          .occasions-grid { gap: 6px; }
          .occasion-card { padding: 14px 8px; }
          .occasion-emoji { font-size: 22px; }
          .occasion-label { font-size: 10px; }

          .rent-cta-group { flex-direction: column; }
          .rent-cta-btn { width: 100%; justify-content: center; }
          .rent-stats { flex-wrap: wrap; }
        }

        /* ══════ LARGE SCREEN ENHANCEMENT ══════ */
        @media (min-width: 1200px) {
          .categories-scroll-wrapper {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
