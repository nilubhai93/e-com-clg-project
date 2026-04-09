import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

export default function CartPage() {
  const { items, subtotal, bundleSuggestion, updateItem, removeItem, clearCart, acceptBundle } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [acceptingBundle, setAcceptingBundle] = useState(false);

  const handleAcceptBundle = async () => {
    setAcceptingBundle(true);
    try { await acceptBundle(); } catch (e) { console.error(e); }
    finally { setAcceptingBundle(false); }
  };

  const deliveryFee = subtotal > 999 ? 0 : 49;
  const bundleDiscount = bundleSuggestion?.isActive ? (subtotal * (bundleSuggestion.discount || 15)) / 100 : 0;
  const total = subtotal - bundleDiscount + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛍️</div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '12px' }}>Your bag is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '15px' }}>Looks like you haven't added anything yet. Let our AI stylist help!</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/products" className="btn btn-primary" style={{ padding: '14px 28px', borderRadius: 'var(--radius-full)' }}>
              <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} /> Start Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 24px 60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Your Bag <span style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: 400 }}>({items.length} items)</span></h1>
        <button onClick={clearCart} style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <DeleteOutlineIcon sx={{ fontSize: 16 }} /> Clear All
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AnimatePresence>
            {items.map(item => (
              <motion.div key={item._id} layout exit={{ opacity: 0, x: -100 }}
                style={{ display: 'flex', gap: '20px', padding: '20px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <Link to={`/products/${item.product?._id}`}>
                  <img src={item.product?.images?.[0] || 'https://placehold.co/100x120/1a1a25/9a9ab0?text=Img'} alt={item.product?.name}
                    style={{ width: '100px', height: '120px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                </Link>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.product?.brand}</div>
                  <Link to={`/products/${item.product?._id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', marginBottom: '6px' }}>{item.product?.name}</h3>
                  </Link>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    <span>Size: <strong style={{ color: 'var(--text-primary)' }}>{item.size}</strong></span>
                    {item.color && <span>Color: <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{item.color}</strong></span>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button onClick={() => updateItem(item._id, item.quantity - 1)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <RemoveIcon sx={{ fontSize: 16 }} />
                      </button>
                      <span style={{ fontWeight: 700, fontSize: '15px', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateItem(item._id, item.quantity + 1)} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AddIcon sx={{ fontSize: 16 }} />
                      </button>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700 }} className="gradient-text">₹{((item.product?.discountPrice || item.product?.price || 0) * item.quantity).toLocaleString()}</div>
                      {item.product?.discountPrice && <div style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{(item.product.price * item.quantity).toLocaleString()}</div>}
                    </div>
                  </div>
                </div>
                <button onClick={() => removeItem(item._id)} style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', padding: '4px' }}>
                  <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Bundle Suggestion */}
          {bundleSuggestion?.isActive && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ padding: '24px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(236,72,153,0.06))', border: '1px solid rgba(168,85,247,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <AutoAwesomeIcon sx={{ color: 'var(--accent-light)', fontSize: 20 }} />
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>⚡ {bundleSuggestion.bundleName || 'Flash Bundle'}</h3>
                <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'var(--gradient-primary)', fontSize: '11px', fontWeight: 700, color: 'white' }}>{bundleSuggestion.discount}% OFF</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
                Bundle these items with your cart for {bundleSuggestion.discount}% off — delivered in the same bag!
              </p>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleAcceptBundle} disabled={acceptingBundle}
                  className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '13px', borderRadius: 'var(--radius-full)' }}>
                  {acceptingBundle ? 'Adding...' : 'Accept Bundle Deal'}
                </motion.button>
                <button style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No thanks</button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div style={{ position: 'sticky', top: '96px' }}>
          <div style={{ padding: '28px', borderRadius: 'var(--radius-xl)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString()}</span>
              </div>
              {bundleDiscount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--success)' }}>Bundle Discount</span>
                <span style={{ fontWeight: 600, color: 'var(--success)' }}>-₹{bundleDiscount.toLocaleString()}</span>
              </div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Delivery</span>
                <span style={{ fontWeight: 600, color: deliveryFee === 0 ? 'var(--success)' : 'var(--text-primary)' }}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: '22px', fontWeight: 800 }} className="gradient-text">₹{Math.round(total).toLocaleString()}</span>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '13px', color: 'var(--success)' }}>
              <LocalShippingOutlinedIcon sx={{ fontSize: 16 }} /> Estimated delivery: <strong>20-30 min</strong>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate(isAuthenticated ? '/checkout' : '/login')}
              style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-primary)', color: 'white', fontSize: '16px', fontWeight: 700, boxShadow: '0 4px 20px var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Proceed to Checkout
            </motion.button>
            {subtotal < 999 && <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>Add ₹{999 - subtotal} more for free delivery</p>}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.container>div:nth-child(2){grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
