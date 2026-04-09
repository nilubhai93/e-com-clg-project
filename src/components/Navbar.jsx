import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PlaceIcon from '@mui/icons-material/Place';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Map from './Map';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [addressQuery, setAddressQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Click outside to close profile popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleAddressSearch = (e) => {
    e.preventDefault();
    if (addressQuery.trim()) {
      console.log('Searching address:', addressQuery.trim());
    }
  };

  const handleMapAddress = (addr) => {
    setAddressQuery(addr);
  };

  const navLinks = [
    { path: '/shop', label: 'Home' },
    { path: '/products', label: 'Shop' },
    { path: '/products?category=dress', label: 'Women' },
    { path: '/products?gender=men', label: 'Men' },
    { path: '/products?deals=true', label: 'Deals' },
  ];

  if (location.pathname === '/') return null;

  return (
    <>
      {/* ══════════ TOP NAV BAR ══════════ */}
      <nav className="navbar-top" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(10, 10, 15, 0.85)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="navbar-inner" style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '100%'
        }}>
          {/* Logo */}
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            textDecoration: 'none', color: 'inherit', flexShrink: 0
          }}>
            <div className="navbar-logo-icon" style={{
              borderRadius: '10px',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, color: 'white'
            }}>F</div>
            <span className="navbar-brand-name" style={{
              fontWeight: 700, letterSpacing: '-0.5px',
              color: 'var(--text-primary)'
            }}>FlashFit</span>
            <span className="navbar-badge" style={{
              background: 'var(--gradient-gold)',
              borderRadius: '20px',
              fontWeight: 700, color: 'white',
              textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>Quick</span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{
            display: 'flex', gap: '4px', alignItems: 'center',
          }} className="desktop-only">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} style={{
                padding: '8px 16px', borderRadius: 'var(--radius-md)',
                fontSize: '14px', fontWeight: 500,
                color: location.pathname === link.path ? 'var(--accent-light)' : 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
                background: location.pathname === link.path ? 'var(--accent-bg)' : 'transparent',
              }}>{link.label}</Link>
            ))}
          </div>

          {/* Delivery Badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: 'var(--radius-full)',
            background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)',
            fontSize: '12px', fontWeight: 600, color: 'var(--success)',
          }} className="desktop-only">
            <LocalShippingOutlinedIcon sx={{ fontSize: 16 }} />
            <span>20 min delivery</span>
          </div>

          {/* Right Actions */}
          <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center' }}>
            {/* Cart */}
            <Link to="/cart" className="navbar-action-btn" style={{
              position: 'relative', borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)', textDecoration: 'none'
            }}>
              <ShoppingBagOutlinedIcon sx={{ fontSize: 22 }} />
              {itemCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{
                  position: 'absolute', top: '2px', right: '2px',
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  color: 'white', fontSize: '10px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{itemCount}</motion.span>
              )}
            </Link>

            {/* Profile */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }} ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="navbar-action-btn"
                  style={{
                    borderRadius: 'var(--radius-md)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: profileOpen ? 'var(--accent-light)' : 'var(--text-secondary)',
                    background: profileOpen ? 'var(--accent-bg)' : 'var(--bg-glass)',
                    border: profileOpen ? '1px solid rgba(168,85,247,0.3)' : '1px solid transparent',
                    cursor: 'pointer', transition: 'all var(--transition-fast)'
                  }}
                >
                  <PersonOutlineIcon sx={{ fontSize: 22 }} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="profile-popup"
                      style={{
                        position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                        width: '280px', zIndex: 1001,
                        borderRadius: 'var(--radius-lg)',
                        background: 'rgba(18, 18, 28, 0.98)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid var(--border)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Close Button */}
                      <button
                        onClick={() => setProfileOpen(false)}
                        style={{
                          position: 'absolute', top: '12px', right: '12px',
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--text-muted)', cursor: 'pointer',
                          transition: 'all var(--transition-fast)', zIndex: 2
                        }}
                        onMouseEnter={e => { e.target.style.color = 'var(--text-primary)'; e.target.style.borderColor = 'var(--accent)'; }}
                        onMouseLeave={e => { e.target.style.color = 'var(--text-muted)'; e.target.style.borderColor = 'var(--border)'; }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </button>

                      {/* User Info Header */}
                      <div style={{
                        padding: '24px 20px 16px',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', gap: '14px'
                      }}>
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '50%',
                          background: 'var(--gradient-primary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '18px', fontWeight: 800, color: 'white', flexShrink: 0
                        }}>
                          {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{
                            fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                          }}>{user?.name || 'User'}</div>
                          <div style={{
                            fontSize: '12px', color: 'var(--text-muted)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                          }}>{user?.email}</div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div style={{ padding: '8px' }}>
                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '12px 14px', borderRadius: 'var(--radius-md)',
                            textDecoration: 'none', color: 'var(--text-primary)',
                            fontSize: '14px', fontWeight: 500,
                            transition: 'background var(--transition-fast)'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <AccountCircleOutlinedIcon sx={{ fontSize: 20, color: 'var(--accent-light)' }} />
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setProfileOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '12px 14px', borderRadius: 'var(--radius-md)',
                            textDecoration: 'none', color: 'var(--text-primary)',
                            fontSize: '14px', fontWeight: 500,
                            transition: 'background var(--transition-fast)'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <ShoppingBagIcon sx={{ fontSize: 20, color: 'var(--accent-light)' }} />
                          My Orders
                        </Link>
                        <Link
                          to="/become-seller"
                          onClick={() => setProfileOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '12px 14px', borderRadius: 'var(--radius-md)',
                            textDecoration: 'none', color: 'var(--text-primary)',
                            fontSize: '14px', fontWeight: 500,
                            transition: 'background var(--transition-fast)'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <StorefrontIcon sx={{ fontSize: 20, color: '#10b981' }} />
                          Become a Seller
                        </Link>
                      </div>

                      {/* Logout */}
                      <div style={{ padding: '4px 8px 8px', borderTop: '1px solid var(--border)' }}>
                        <button
                          onClick={() => { logout(); setProfileOpen(false); navigate('/'); }}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '12px 14px', borderRadius: 'var(--radius-md)',
                            color: 'var(--error)', fontSize: '14px', fontWeight: 500,
                            background: 'transparent', cursor: 'pointer', textAlign: 'left',
                            border: 'none', transition: 'background var(--transition-fast)'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <LogoutIcon sx={{ fontSize: 20 }} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary navbar-signin-btn">Sign In</Link>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu-btn" style={{
              borderRadius: 'var(--radius-md)',
              alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)',
            }}>
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════ SEARCH BAR + ADDRESS BAR (below navbar) ══════════ */}
      {/* <div className="search-address-wrapper" style={{
        position: 'fixed',
        left: 0,
        right: 0,
        zIndex: 999,
        background: 'rgba(12, 12, 18, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="search-address-inner" style={{
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          
          <form
            onSubmit={handleSearch}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)',
              transition: 'border var(--transition-fast)',
            }}
            className="search-bar-form"
          >
            <SearchIcon sx={{ fontSize: 20, color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              id="navbar-search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for styles, brands, occasions..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                minWidth: 0,
              }}
              className="search-input"
            />
            <button
              type="submit"
              className="search-submit-btn"
              style={{
                borderRadius: 'var(--radius-full)',
                background: 'var(--gradient-primary)',
                color: 'white',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 10px var(--accent-glow)',
                transition: 'all var(--transition-fast)',
                flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Search
            </button>
          </form>

         
          <form
            onSubmit={handleAddressSearch}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                transition: 'border var(--transition-fast)',
              }}
              className="address-bar-form"
            >
              <PlaceIcon sx={{ fontSize: 20, color: 'var(--success)', flexShrink: 0 }} />
              <input
                id="navbar-address-input"
                type="text"
                value={addressQuery}
                onChange={e => setAddressQuery(e.target.value)}
                placeholder="Enter delivery address..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  minWidth: 0,
                }}
                className="address-input"
              />
              <button
                type="submit"
                className="address-submit-btn"
                style={{
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(34, 197, 94, 0.12)',
                  color: 'var(--success)',
                  fontWeight: 600,
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(34,197,94,0.2)';
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(34,197,94,0.12)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Set Address
              </button>
            </div>


            <Map onAddressSelect={handleMapAddress} />
          </form>
        </div>
      </div> */}






















      {/* Mobile Menu and Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 998, background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)'
              }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="mobile-drawer"
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: '280px', zIndex: 999,
                background: 'var(--bg-secondary)',
                borderLeft: '1px solid var(--border)',
                padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px',
                paddingTop: '80px'
              }}
            >
              {navLinks.map(link => (
                <Link key={link.path} to={link.path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '14px 20px', borderRadius: 'var(--radius-md)',
                    fontSize: '15px', fontWeight: 500,
                    color: 'var(--text-primary)', textDecoration: 'none',
                    background: location.pathname === link.path ? 'var(--accent-bg)' : 'transparent',
                  }}>{link.label}</Link>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', margin: '12px 0' }} />
              {isAuthenticated ? (
                <>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} style={{
                    padding: '14px 20px', borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)', textDecoration: 'none', fontSize: '15px'
                  }}>Orders</Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} style={{
                    padding: '14px 20px', borderRadius: 'var(--radius-md)',
                    color: 'var(--error)', fontSize: '15px', textAlign: 'left'
                  }}>Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{
                  marginTop: '8px'
                }}>Sign In</Link>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        /* ── Desktop defaults ── */
        .navbar-top {
          height: 64px;
        }
        .navbar-inner {
          padding: 0 24px;
        }
        .navbar-logo-icon {
          width: 36px;
          height: 36px;
          font-size: 18px;
        }
        .navbar-brand-name {
          font-size: 20px;
        }
        .navbar-badge {
          padding: 2px 8px;
          font-size: 10px;
        }
        .navbar-actions {
          gap: 8px;
        }
        .navbar-action-btn {
          width: 40px;
          height: 40px;
        }
        .navbar-signin-btn {
          padding: 8px 20px !important;
          font-size: 13px !important;
        }
        .mobile-menu-btn {
          display: none !important;
          width: 40px;
          height: 40px;
        }

        /* ── Search/Address bar ── */
        .search-address-wrapper {
          top: 64px;
          padding: 10px 0;
        }
        .search-address-inner {
          max-width: 960px;
          padding: 0 24px;
          gap: 8px;
        }
        .search-bar-form {
          padding: 4px 6px 4px 18px;
        }
        .search-input {
          font-size: 14px;
          padding: 10px 0;
        }
        .search-submit-btn {
          padding: 8px 20px;
          font-size: 13px;
        }
        .address-bar-form {
          padding: 4px 6px 4px 18px;
        }
        .address-input {
          font-size: 13px;
          padding: 9px 0;
        }
        .address-submit-btn {
          padding: 7px 16px;
          font-size: 12px;
        }

        .search-bar-form:focus-within {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 3px var(--accent-bg);
        }
        .address-bar-form:focus-within {
          border-color: rgba(34,197,94,0.4) !important;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.08);
        }

        .desktop-only { display: flex !important; }

        /* ── Profile popup mobile ── */
        @media (max-width: 480px) {
          .profile-popup {
            width: 260px !important;
            right: -8px !important;
          }
        }

        /* ── Tablet (≤ 768px) ── */
        @media (max-width: 768px) {
          .navbar-top {
            height: 56px;
          }
          .navbar-inner {
            padding: 0 16px;
          }
          .navbar-logo-icon {
            width: 32px;
            height: 32px;
            font-size: 16px;
          }
          .navbar-brand-name {
            font-size: 17px;
          }
          .navbar-badge {
            padding: 2px 6px;
            font-size: 9px;
          }
          .navbar-actions {
            gap: 6px;
          }
          .navbar-action-btn {
            width: 36px;
            height: 36px;
          }
          .desktop-only { display: none !important; }
          .mobile-menu-btn {
            display: flex !important;
            width: 36px;
            height: 36px;
          }

          .search-address-wrapper {
            top: 56px;
            padding: 8px 0;
          }
          .search-address-inner {
            max-width: 100%;
            padding: 0 16px;
            gap: 6px;
          }
          .search-bar-form {
            padding: 3px 5px 3px 14px;
          }
          .search-input {
            font-size: 13px;
            padding: 8px 0;
          }
          .search-submit-btn {
            padding: 7px 16px;
            font-size: 12px;
          }
          .address-bar-form {
            padding: 3px 5px 3px 14px;
          }
          .address-input {
            font-size: 12px;
            padding: 7px 0;
          }
          .address-submit-btn {
            padding: 6px 12px;
            font-size: 11px;
          }
        }

        /* ── Small phone (≤ 480px) ── */
        @media (max-width: 480px) {
          .navbar-top {
            height: 52px;
          }
          .navbar-inner {
            padding: 0 12px;
          }
          .navbar-logo-icon {
            width: 28px;
            height: 28px;
            font-size: 14px;
            border-radius: 8px;
          }
          .navbar-brand-name {
            font-size: 15px;
          }
          .navbar-badge {
            padding: 1px 5px;
            font-size: 8px;
          }
          .navbar-actions {
            gap: 4px;
          }
          .navbar-action-btn {
            width: 32px;
            height: 32px;
          }
          .mobile-menu-btn {
            width: 32px;
            height: 32px;
          }
          .navbar-signin-btn {
            padding: 6px 14px !important;
            font-size: 11px !important;
          }

          .search-address-wrapper {
            top: 52px;
            padding: 6px 0;
          }
          .search-address-inner {
            padding: 0 12px;
            gap: 5px;
          }
          .search-bar-form {
            padding: 2px 4px 2px 12px;
          }
          .search-input {
            font-size: 12px;
            padding: 7px 0;
          }
          .search-submit-btn {
            padding: 6px 12px;
            font-size: 11px;
          }
          .address-bar-form {
            padding: 2px 4px 2px 12px;
          }
          .address-input {
            font-size: 11px;
            padding: 6px 0;
          }
          .address-submit-btn {
            padding: 5px 10px;
            font-size: 10px;
          }
        }

        /* ── Extra small (≤ 360px) ── */
        @media (max-width: 360px) {
          .navbar-inner {
            padding: 0 8px;
          }
          .navbar-brand-name {
            font-size: 14px;
          }
          .navbar-badge {
            display: none;
          }
          .search-address-inner {
            padding: 0 8px;
          }
        }
      `}</style>
    </>
  );
}
