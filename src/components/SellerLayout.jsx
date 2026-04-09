import { motion } from 'framer-motion';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function SellerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only allow sellers
    if (user && user.role !== 'seller' && user.role !== 'admin') {
      navigate('/shop');
    }
  }, [user, navigate]);

  const navItems = [
    { name: 'Dashboard', path: '/seller', icon: <DashboardIcon /> },
    { name: 'My Products', path: '/seller/products', icon: <InventoryIcon /> },
    { name: 'Add Product', path: '/seller/add-product', icon: <AddCircleOutlineIcon /> },
    // Settings can be a placeholder for future implementation
    { name: 'Settings', path: '/seller/settings', icon: <SettingsIcon /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', background: 'var(--bg-secondary)', paddingTop: '64px' }}>

      {/* Sidebar Navigation */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        style={{
          width: '260px',
          background: 'var(--bg-card)',
          borderRight: '1px solid var(--border)',
          padding: '30px 20px',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed', // Fixed so it doesn't scroll with content
          top: '64px', // Below top navbar
          bottom: 0,
          left: 0,
          zIndex: 10
        }}
      >
        <div style={{ marginBottom: '40px', paddingLeft: '10px' }}>
          <h2 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 700 }}>
            Seller Central
          </h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/seller'} // 'end' ensures /seller doesn't match /seller/add
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '12px 16px', borderRadius: 'var(--radius-md)',
                textDecoration: 'none', fontSize: '15px', fontWeight: 600,
                color: isActive ? 'white' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent)' : 'transparent',
                transition: 'all var(--transition-fast)'
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.style.background.includes('var(--accent)')) {
                  e.currentTarget.style.background = 'var(--bg-elevated)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.className.includes('active')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <button
            onClick={() => { logout(); navigate('/'); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px', width: '100%',
              padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'transparent',
              border: 'none', color: 'var(--error)', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
              textAlign: 'left'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogoutIcon />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        marginLeft: '260px', // Offset by sidebar width
        padding: '40px',
        maxWidth: '1200px'
      }}>
        <Outlet />
      </main>

    </div>
  );
}
