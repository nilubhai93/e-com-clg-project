import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InventoryIcon from '@mui/icons-material/Inventory';
import StorefrontIcon from '@mui/icons-material/Storefront';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';

export default function OrderTracking() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !id) return;
    const load = async () => {
      try {
        const [orderRes, trackRes] = await Promise.all([
          orderAPI.getById(id),
          orderAPI.track(id)
        ]);
        setOrder(orderRes.data.order);
        setTracking(trackRes.data.tracking);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();

    // Poll tracking every 30s
    const interval = setInterval(async () => {
      try {
        const res = await orderAPI.track(id);
        setTracking(res.data.tracking);
      } catch (e) {}
    }, 30000);

    return () => clearInterval(interval);
  }, [id, isAuthenticated]);

  const steps = [
    { key: 'placed', label: 'Order Placed', icon: <CheckCircleIcon sx={{ fontSize: 20 }} />, desc: 'We received your order' },
    { key: 'confirmed', label: 'Confirmed', icon: <InventoryIcon sx={{ fontSize: 20 }} />, desc: 'Order verified & confirmed' },
    { key: 'picking', label: 'Picking', icon: <StorefrontIcon sx={{ fontSize: 20 }} />, desc: 'Items being picked' },
    { key: 'out-for-delivery', label: 'Out for Delivery', icon: <DeliveryDiningIcon sx={{ fontSize: 20 }} />, desc: 'On the way to you' },
    { key: 'delivered', label: 'Delivered', icon: <CheckCircleIcon sx={{ fontSize: 20 }} />, desc: 'Enjoy your fashion!' },
  ];

  const statusOrder = steps.map(s => s.key);
  const currentIndex = statusOrder.indexOf(order?.status || 'placed');

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px' }}>Please sign in</h2>
        <Link to="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 24px', maxWidth: '800px' }}>
        <div className="skeleton" style={{ height: '200px', marginBottom: '16px' }} />
        <div className="skeleton" style={{ height: '300px' }} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Order not found</h2>
        <Link to="/orders" className="btn btn-primary" style={{ marginTop: '16px' }}>View Orders</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 24px 60px', maxWidth: '800px' }}>
      <Link to="/orders" style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '24px', fontSize: '14px'
      }}>
        <ArrowBackIcon sx={{ fontSize: 18 }} /> Back to Orders
      </Link>

      <h1 style={{
        fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '8px'
      }}>
        Order #{order._id.slice(-8).toUpperCase()}
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>
        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </p>

      {/* Live Progress Bar */}
      {tracking && order.status !== 'delivered' && order.status !== 'cancelled' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '24px', borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(236,72,153,0.05))',
            border: '1px solid rgba(168,85,247,0.2)', marginBottom: '32px'
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LocalShippingOutlinedIcon sx={{ color: 'var(--accent-light)' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Live Tracking</span>
            </div>
            <span style={{ fontSize: '24px', fontWeight: 800 }} className="gradient-text">
              {tracking.minutesRemaining > 0 ? `${tracking.minutesRemaining} min` : 'Arriving!'}
            </span>
          </div>
          <div style={{
            height: '8px', borderRadius: '4px', background: 'var(--bg-elevated)', overflow: 'hidden'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${tracking.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                height: '100%', borderRadius: '4px',
                background: 'var(--gradient-primary)',
                boxShadow: '0 0 15px var(--accent-glow)'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>Order placed</span>
            <span>{tracking.progress}% complete</span>
            <span>Delivered</span>
          </div>
        </motion.div>
      )}

      {/* Stepper */}
      <div style={{
        padding: '32px', borderRadius: 'var(--radius-xl)',
        background: 'var(--bg-card)', border: '1px solid var(--border)', marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {steps.map((step, i) => {
            const isCompleted = i <= currentIndex;
            const isCurrent = i === currentIndex;
            return (
              <div key={step.key} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <motion.div
                    initial={isCurrent ? { scale: 0.8 } : {}}
                    animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                    transition={isCurrent ? { repeat: Infinity, duration: 2 } : {}}
                    style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: isCompleted ? 'var(--gradient-primary)' : 'var(--bg-elevated)',
                      border: `2px solid ${isCompleted ? 'transparent' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isCompleted ? 'white' : 'var(--text-muted)',
                      boxShadow: isCurrent ? '0 0 20px var(--accent-glow)' : 'none'
                    }}
                  >{step.icon}</motion.div>
                  {i < steps.length - 1 && (
                    <div style={{
                      width: '2px', height: '40px',
                      background: i < currentIndex ? 'var(--accent)' : 'var(--border)'
                    }} />
                  )}
                </div>
                <div style={{ paddingBottom: i < steps.length - 1 ? '20px' : 0 }}>
                  <div style={{
                    fontSize: '14px', fontWeight: 700,
                    color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)',
                    marginTop: '8px'
                  }}>{step.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Items */}
      <div style={{
        padding: '24px', borderRadius: 'var(--radius-xl)',
        background: 'var(--bg-card)', border: '1px solid var(--border)'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Items</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {order.items?.map((item, j) => (
            <div key={j} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)'
            }}>
              {item.image && <img src={item.image} alt="" style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover' }} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Size: {item.size} × {item.quantity}
                </div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border)', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700 }}>Total</span>
          <span style={{ fontSize: '20px', fontWeight: 800 }} className="gradient-text">
            ₹{order.totalAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
