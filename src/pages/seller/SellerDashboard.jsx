import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import api from '../../api/index';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function SellerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/seller/dashboard/dashboard-stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}><CircularProgress sx={{ color: 'var(--accent)' }}/></div>;
  }

  const statCards = [
    { title: 'Total Revenue', value: `$\${stats?.totalRevenue || 0}`, icon: <AttachMoneyOutlinedIcon sx={{ fontSize: 28, color: '#10b981' }} />, bg: 'rgba(16, 185, 129, 0.1)' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: <ReceiptLongOutlinedIcon sx={{ fontSize: 28, color: '#3b82f6' }} />, bg: 'rgba(59, 130, 246, 0.1)' },
    { title: 'Active Products', value: `\${stats?.activeProducts || 0} / \${stats?.totalProducts || 0}`, icon: <Inventory2OutlinedIcon sx={{ fontSize: 28, color: '#a855f7' }} />, bg: 'rgba(168, 85, 247, 0.1)' }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Overview</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Welcome to your seller command center</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {statCards.map((stat, i) => (
          <div key={i} style={{ 
            background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', 
            padding: '24px', display: 'flex', alignItems: 'center', gap: '20px'
          }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.title}</p>
              <h3 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{stat.value}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>
                <TrendingUpIcon sx={{ fontSize: 14 }} /> +12% this week
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>Recently Added Products</h2>
        
        {stats?.recentProducts?.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats.recentProducts.map(product => (
              <div key={product._id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                <img src={product.images[0]} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{product.name}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{product.brand} &bull; {product.category}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>${product.price.toFixed(2)}</p>
                  <span style={{ 
                    display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                    background: product.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: product.isActive ? '#10b981' : '#ef4444', marginTop: '4px'
                  }}>
                    {product.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            You haven't added any products yet. Go to "Add Product" to get started!
          </div>
        )}
      </div>

    </motion.div>
  );
}
