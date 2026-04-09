import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      try {
        const res = await orderAPI.getAll();
        setOrders(res.data.orders || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [isAuthenticated]);

  const statusColors = {
    placed: 'var(--info)', confirmed: 'var(--accent)', picking: 'var(--warning)',
    'out-for-delivery': '#f97316', delivered: 'var(--success)', cancelled: 'var(--error)'
  };

  const statusIcons = {
    placed: <InventoryIcon sx={{ fontSize: 16 }} />,
    confirmed: <CheckCircleIcon sx={{ fontSize: 16 }} />,
    delivered: <CheckCircleIcon sx={{ fontSize: 16 }} />,
    'out-for-delivery': <LocalShippingOutlinedIcon sx={{ fontSize: 16 }} />
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px' }}>Please sign in to view orders</h2>
        <Link to="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 24px 60px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '32px' }}>My Orders</h1>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '120px' }} />)}
        </div>
      ) : orders.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>No orders yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Start shopping to place your first order!</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order, i) => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ padding: '24px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Order #{order._id.slice(-8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800 }} className="gradient-text">₹{order.totalAmount.toLocaleString()}</div>
                  {order.isBundle && <span style={{ fontSize: '11px', color: 'var(--success)' }}>Bundle discount: -₹{order.bundleDiscount}</span>}
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '6px 14px', borderRadius: 'var(--radius-full)',
                  background: `${statusColors[order.status]}18`, color: statusColors[order.status],
                  fontSize: '12px', fontWeight: 700, textTransform: 'capitalize'
                }}>
                  {statusIcons[order.status]} {order.status.replace('-', ' ')}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {order.items?.map((item, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', fontSize: '12px' }}>
                    {item.image && <img src={item.image} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />}
                    <span style={{ color: 'var(--text-primary)' }}>{item.name} x{item.quantity}</span>
                  </div>
                ))}
              </div>
              {order.estimatedDeliveryMinutes && order.status !== 'delivered' && (
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--success)' }}>
                    <LocalShippingOutlinedIcon sx={{ fontSize: 14 }} /> Est. delivery: {order.estimatedDeliveryMinutes} min
                  </div>
                  <Link to={`/orders/${order._id}/track`} style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-full)',
                    background: 'var(--accent-bg)', color: 'var(--accent-light)',
                    fontSize: '12px', fontWeight: 600, textDecoration: 'none',
                    border: '1px solid rgba(168,85,247,0.2)'
                  }}>
                    Track Order →
                  </Link>
                </div>
              )}
              {order.status === 'delivered' && (
                <div style={{ marginTop: '12px' }}>
                  <Link to={`/orders/${order._id}/track`} style={{
                    fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none'
                  }}>
                    View Details →
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
