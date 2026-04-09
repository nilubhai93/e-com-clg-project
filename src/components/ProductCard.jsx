import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, items, updateItem, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [selectedSize, setSelectedSize] = useState('');
  const [adding, setAdding] = useState(false);
  const [liked, setLiked] = useState(false);

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedSize) {
      const availableSize = product.sizes?.find(s => s.stock > 0);
      if (availableSize) setSelectedSize(availableSize.size);
      else return;
    }
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id, selectedSize || product.sizes?.[0]?.size, product.colors?.[0]);
    } catch (err) {
      console.error('Add to cart failed:', err);
    } finally {
      setTimeout(() => setAdding(false), 500);
    }
  };

  const fastDelivery = product.deliveryZones?.some(z => z.estimatedMinutes <= 30);

  const cartItem = items?.find(i => i.product?._id === product._id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      style={{
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        transition: 'all var(--transition-base)',
        position: 'relative'
      }}
      whileHover={{ y: -4, borderColor: 'rgba(168, 85, 247, 0.3)' }}
    >
      <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
          <img
            src={product.images?.[0] || 'https://placehold.co/300x400/1a1a25/9a9ab0?text=No+Image'}
            alt={product.name}
            loading="lazy"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform var(--transition-slow)'
            }}
            onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
          />

          {/* Badges */}
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            display: 'flex', flexDirection: 'column', gap: '6px'
          }}>
            {hasDiscount && (
              <span style={{
                padding: '4px 10px', borderRadius: 'var(--radius-full)',
                background: 'var(--gradient-gold)',
                fontSize: '11px', fontWeight: 700, color: 'white'
              }}>-{discountPercent}%</span>
            )}
            {product.isAvailableForRent && (
              <span style={{
                padding: '4px 10px', borderRadius: 'var(--radius-full)',
                background: 'var(--gradient-secondary)',
                fontSize: '11px', fontWeight: 700, color: 'white'
              }}>Rent</span>
            )}
            {fastDelivery && (
              <span style={{
                padding: '4px 10px', borderRadius: 'var(--radius-full)',
                background: 'rgba(34, 197, 94, 0.9)',
                fontSize: '11px', fontWeight: 700, color: 'white',
                display: 'flex', alignItems: 'center', gap: '3px'
              }}>
                <LocalShippingOutlinedIcon sx={{ fontSize: 12 }} /> 20min
              </span>
            )}
          </div>

          {/* Wishlist */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked); }}
            style={{
              position: 'absolute', top: '12px', right: '12px',
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: liked ? '#ef4444' : 'white', border: 'none', cursor: 'pointer'
            }}
          >
            <FavoriteBorderIcon sx={{ fontSize: 18 }} />
          </motion.button>
        </div>

        {/* Info */}
        <div style={{ padding: '16px' }}>
          <div style={{
            fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px'
          }}>{product.brand}</div>

          <h3 style={{
            fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)',
            lineHeight: 1.4, marginBottom: '8px',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>{product.name}</h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <StarIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
            <span style={{
              fontSize: '18px', fontWeight: 800,
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>₹{price.toLocaleString()}</span>
            {hasDiscount && (
              <span style={{
                fontSize: '13px', color: 'var(--text-muted)',
                textDecoration: 'line-through'
              }}>₹{product.price.toLocaleString()}</span>
            )}
          </div>

          {/* Sizes */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {product.sizes?.slice(0, 5).map(s => (
              <button
                key={s.size}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedSize(s.size); }}
                style={{
                  padding: '4px 10px', borderRadius: 'var(--radius-sm)',
                  fontSize: '11px', fontWeight: 600,
                  background: selectedSize === s.size ? 'var(--accent-bg)' : 'var(--bg-elevated)',
                  color: selectedSize === s.size ? 'var(--accent-light)' : 'var(--text-muted)',
                  border: `1px solid ${selectedSize === s.size ? 'var(--accent)' : 'transparent'}`,
                  cursor: s.stock > 0 ? 'pointer' : 'not-allowed',
                  opacity: s.stock > 0 ? 1 : 0.3
                }}
              >{s.size}</button>
            ))}
          </div>
        </div>
      </Link>

      {/* Add to Cart */}
      <div style={{ padding: '0 16px 16px' }}>
        {qtyInCart > 0 ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--accent-bg)', borderRadius: 'var(--radius-md)',
            padding: '4px', border: '1px solid var(--accent)'
          }}>
            <button
              onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                if (qtyInCart > 1) updateItem(cartItem._id, qtyInCart - 1);
                else removeItem(cartItem._id);
              }}
              style={{
                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-card)', color: 'var(--text-primary)',
                border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                fontSize: '18px', fontWeight: 'bold'
              }}
            >-</button>
            <span style={{ fontWeight: 600, color: 'var(--accent-light)', fontSize: '13px' }}>
              {qtyInCart} in Bag
            </span>
            <button
              onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                updateItem(cartItem._id, qtyInCart + 1);
              }}
              style={{
                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-card)', color: 'var(--text-primary)',
                border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                fontSize: '18px', fontWeight: 'bold'
              }}
            >+</button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={adding}
            style={{
              width: '100%', padding: '10px',
              borderRadius: 'var(--radius-md)',
              background: adding ? 'var(--success)' : 'var(--gradient-primary)',
              color: 'white',
              fontSize: '13px', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'all var(--transition-fast)'
            }}
          >
            <ShoppingBagOutlinedIcon sx={{ fontSize: 16 }} />
            {adding ? 'Added!' : 'Add to Bag'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
