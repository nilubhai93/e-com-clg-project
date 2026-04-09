import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../api';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CelebrationIcon from '@mui/icons-material/Celebration';

export default function Checkout() {
  const { items, subtotal, bundleSuggestion, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=address, 2=payment, 3=confirm
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const [address, setAddress] = useState({
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    zip: user?.addresses?.[0]?.zip || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  const deliveryFee = subtotal > 999 ? 0 : 49;
  const bundleDiscount = bundleSuggestion?.isActive ? (subtotal * (bundleSuggestion.discount || 15)) / 100 : 0;
  const total = subtotal - bundleDiscount + deliveryFee;

  const inputStyle = {
    width: '100%', padding: '14px 18px', borderRadius: 'var(--radius-md)',
    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
    transition: 'border var(--transition-fast)'
  };

  const paymentOptions = [
    { value: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when it arrives' },
    { value: 'upi', label: 'UPI', icon: '📱', desc: 'Google Pay, PhonePe, etc.' },
    { value: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, Rupay' },
    { value: 'wallet', label: 'Wallet', icon: '👛', desc: 'Paytm, Amazon Pay' },
  ];

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.create({
        deliveryAddress: address,
        paymentMethod
      });
      setOrderResult(res.data);
      setStep(3);
      // Cart will be cleared server-side
      await clearCart();
    } catch (err) {
      console.error('Place order error:', err);
      alert(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (items.length === 0 && !orderResult) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>No items to checkout</h2>
        <Link to="/products" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  // Step 3 — Success
  if (step === 3 && orderResult) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center', maxWidth: '600px' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            background: 'rgba(34,197,94,0.15)', margin: '0 auto 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <CelebrationIcon sx={{ fontSize: 48, color: 'var(--success)' }} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 style={{
            fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-display)',
            marginBottom: '12px'
          }}>
            Order Placed! <span className="gradient-text">🎉</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '32px' }}>
            Your fashion is on its way — estimated delivery in <strong style={{ color: 'var(--success)' }}>
              {orderResult.estimatedDelivery}
            </strong>
          </p>

          <div style={{
            padding: '24px', borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            marginBottom: '24px', textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Order #{orderResult.order?._id?.slice(-8).toUpperCase()}
              </span>
              <span style={{
                padding: '4px 12px', borderRadius: 'var(--radius-full)',
                background: 'rgba(59,130,246,0.15)', color: 'var(--info)',
                fontSize: '11px', fontWeight: 700
              }}>
                {orderResult.order?.status?.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800 }} className="gradient-text">
              ₹{Math.round(orderResult.order?.totalAmount || 0).toLocaleString()}
            </div>
            {orderResult.order?.discount > 0 && (
              <div style={{ fontSize: '13px', color: 'var(--success)', marginTop: '4px' }}>
                Bundle discount saved you ₹{orderResult.order.discount}!
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/orders" className="btn btn-primary"
              style={{ padding: '14px 28px', borderRadius: 'var(--radius-full)' }}>
              <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} /> Track Order
            </Link>
            <Link to="/products" className="btn btn-outline"
              style={{ padding: '14px 28px', borderRadius: 'var(--radius-full)' }}>
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 24px 60px', maxWidth: '900px' }}>
      {/* Back */}
      <Link to="/cart" style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '24px', fontSize: '14px'
      }}>
        <ArrowBackIcon sx={{ fontSize: 18 }} /> Back to Cart
      </Link>

      {/* Steps */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px'
      }}>
        {[
          { num: 1, label: 'Delivery', icon: <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} /> },
          { num: 2, label: 'Payment', icon: <PaymentIcon sx={{ fontSize: 18 }} /> },
          { num: 3, label: 'Confirm', icon: <CheckCircleIcon sx={{ fontSize: 18 }} /> }
        ].map((s, i) => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: step >= s.num ? 'var(--gradient-primary)' : 'var(--bg-card)',
              border: `1px solid ${step >= s.num ? 'transparent' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: step >= s.num ? 'white' : 'var(--text-muted)',
              transition: 'all var(--transition-base)'
            }}>{s.icon}</div>
            <span style={{
              fontSize: '13px', fontWeight: 600,
              color: step >= s.num ? 'var(--text-primary)' : 'var(--text-muted)'
            }}>{s.label}</span>
            {i < 2 && <div style={{
              width: '40px', height: '2px',
              background: step > s.num ? 'var(--accent)' : 'var(--border)'
            }} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
        {/* Left — Form */}
        <div>
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              style={{
                padding: '32px', borderRadius: 'var(--radius-xl)',
                background: 'var(--bg-card)', border: '1px solid var(--border)'
              }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LocalShippingOutlinedIcon sx={{ color: 'var(--accent-light)' }} /> Delivery Address
              </h2>

              <div style={{ display: 'grid', gap: '18px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Street Address</label>
                  <input value={address.street} onChange={e => setAddress({...address, street: e.target.value})}
                    placeholder="123 Main Street, Apt 4B" required style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>City</label>
                    <input value={address.city} onChange={e => setAddress({...address, city: e.target.value})}
                      placeholder="Mumbai" required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>State</label>
                    <input value={address.state} onChange={e => setAddress({...address, state: e.target.value})}
                      placeholder="Maharashtra" required style={inputStyle} />
                  </div>
                </div>
                <div style={{ maxWidth: '200px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>ZIP Code</label>
                  <input value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})}
                    placeholder="400001" required style={inputStyle} />
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!address.street || !address.city || !address.zip) {
                    alert('Please fill all address fields');
                    return;
                  }
                  setStep(2);
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '16px', marginTop: '28px', fontSize: '15px', borderRadius: 'var(--radius-lg)' }}>
                Continue to Payment →
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              style={{
                padding: '32px', borderRadius: 'var(--radius-xl)',
                background: 'var(--bg-card)', border: '1px solid var(--border)'
              }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PaymentIcon sx={{ color: 'var(--accent-light)' }} /> Payment Method
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {paymentOptions.map(opt => (
                  <motion.button key={opt.value} whileHover={{ scale: 1.01 }}
                    onClick={() => setPaymentMethod(opt.value)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      padding: '18px 20px', borderRadius: 'var(--radius-lg)',
                      background: paymentMethod === opt.value ? 'var(--accent-bg)' : 'var(--bg-elevated)',
                      border: `1.5px solid ${paymentMethod === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                      cursor: 'pointer', textAlign: 'left', width: '100%',
                      transition: 'all var(--transition-fast)'
                    }}>
                    <span style={{ fontSize: '24px' }}>{opt.icon}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{opt.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opt.desc}</div>
                    </div>
                    <div style={{
                      marginLeft: 'auto', width: '20px', height: '20px', borderRadius: '50%',
                      border: `2px solid ${paymentMethod === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                      background: paymentMethod === opt.value ? 'var(--accent)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {paymentMethod === opt.value && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />}
                    </div>
                  </motion.button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button onClick={() => setStep(1)} className="btn btn-outline"
                  style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-lg)' }}>
                  ← Back
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handlePlaceOrder} disabled={loading}
                  className="btn btn-primary"
                  style={{ flex: 2, padding: '16px', fontSize: '15px', borderRadius: 'var(--radius-lg)', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Placing Order...' : `Place Order · ₹${Math.round(total).toLocaleString()}`}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right — Summary */}
        <div style={{ position: 'sticky', top: '96px' }}>
          <div style={{
            padding: '24px', borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-card)', border: '1px solid var(--border)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Order Summary</h3>

            {/* Items mini list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {items.slice(0, 4).map(item => (
                <div key={item._id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img src={item.product?.images?.[0] || 'https://placehold.co/48x48/1a1a25/9a9ab0?text=Img'}
                    alt="" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.product?.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {item.size} × {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹{((item.product?.discountPrice || item.product?.price || 0) * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
              {items.length > 4 && (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  +{items.length - 4} more items
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {bundleDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--success)' }}>Bundle Discount</span>
                  <span style={{ color: 'var(--success)' }}>-₹{bundleDiscount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                <span style={{ color: deliveryFee === 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '15px', fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: '20px', fontWeight: 800 }} className="gradient-text">
                  ₹{Math.round(total).toLocaleString()}
                </span>
              </div>
            </div>

            <div style={{
              marginTop: '16px', padding: '10px 14px', borderRadius: 'var(--radius-md)',
              background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '12px', color: 'var(--success)'
            }}>
              <LocalShippingOutlinedIcon sx={{ fontSize: 16 }} />
              Est. delivery: <strong>20-30 min</strong>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){.container>div:last-child{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
