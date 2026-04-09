import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HomeIcon from '@mui/icons-material/Home';
import ReplayIcon from '@mui/icons-material/Replay';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import CategoryIcon from '@mui/icons-material/Category';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import DiamondIcon from '@mui/icons-material/Diamond';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      path: '/shop',
      icon: HomeOutlinedIcon,
      activeIcon: HomeIcon,
      match: (p) => p === '/shop'
    },
    {
      id: 'buyagain',
      label: 'Buy Again',
      path: '/orders',
      icon: ReplayIcon,
      activeIcon: ReplayIcon,
      match: (p) => p === '/orders'
    },
    {
      id: 'bucket',
      label: 'Bucket',
      path: '/cart',
      icon: ShoppingBagOutlinedIcon,
      activeIcon: ShoppingBagIcon,
      badge: itemCount,
      match: (p) => p === '/cart'
    },
    {
      id: 'categories',
      label: 'Categories',
      path: '/products',
      icon: CategoryOutlinedIcon,
      activeIcon: CategoryIcon,
      match: (p) => p === '/products' || p.startsWith('/products?')
    },
    {
      id: 'rent',
      label: 'Rent',
      path: '/rent',
      icon: DiamondOutlinedIcon,
      activeIcon: DiamondIcon,
      upcoming: true,
      match: (p) => p === '/rent'
    }
  ];

  const isActive = (tab) => tab.match(location.pathname);

  if (location.pathname === '/') return null;

  return (
    <>
      {/* Spacer to prevent content from being hidden behind the fixed footer */}
      <div id="bottom-nav-spacer" style={{ height: '80px' }} />

      <motion.nav
        id="bottom-nav"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          background: 'rgba(10, 10, 15, 0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
          padding: '0 8px',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          maxWidth: '560px',
          margin: '0 auto',
          height: '68px',
        }}>
          {tabs.map((tab) => {
            const active = isActive(tab);
            const IconComp = active ? tab.activeIcon : tab.icon;

            return (
              <motion.button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                whileTap={{ scale: 0.85 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '8px 12px',
                  borderRadius: '16px',
                  background: active
                    ? 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(236,72,153,0.08))'
                    : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  minWidth: '56px',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {/* Active indicator dot */}
                {active && (
                  <motion.div
                    layoutId="footer-indicator"
                    style={{
                      position: 'absolute',
                      top: '-1px',
                      width: '20px',
                      height: '3px',
                      borderRadius: '0 0 4px 4px',
                      background: 'linear-gradient(90deg, #a855f7, #ec4899)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                {/* Icon wrapper */}
                <div style={{ position: 'relative' }}>
                  <IconComp
                    sx={{
                      fontSize: 24,
                      color: active ? '#c084fc' : 'rgba(255,255,255,0.4)',
                      transition: 'color 0.25s ease',
                    }}
                  />

                  {/* Cart badge */}
                  {tab.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-8px',
                        minWidth: '16px',
                        height: '16px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                        color: 'white',
                        fontSize: '9px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 4px',
                        boxShadow: '0 2px 8px rgba(168,85,247,0.4)',
                      }}
                    >
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </motion.span>
                  )}

                  {/* Upcoming "NEW" badge */}
                  {tab.upcoming && (
                    <span style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-14px',
                      padding: '1px 4px',
                      borderRadius: '4px',
                      background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                      color: 'white',
                      fontSize: '6px',
                      fontWeight: 900,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      lineHeight: 1.4,
                    }}>
                      NEW
                    </span>
                  )}
                </div>

                {/* Label */}
                <span style={{
                  fontSize: '10px',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#e9d5ff' : 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.2px',
                  transition: 'all 0.25s ease',
                  whiteSpace: 'nowrap',
                }}>
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.nav>

      <style>{`
        @media (min-width: 768px) {
          #bottom-nav, #bottom-nav-spacer {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
