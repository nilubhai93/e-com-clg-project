import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productAPI } from '../../api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getById(id);
        setProduct(res.data.product);
        if (res.data.product.colors?.length) setSelectedColor(res.data.product.colors[0]);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAdd = async () => {
    if (!selectedSize) return;
    if (!isAuthenticated) { window.location.href = '/login'; return; }
    setAdding(true);
    try {
      await addToCart(product._id, selectedSize, selectedColor);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (e) { console.error(e); }
    finally { setAdding(false); }
  };

  if (loading) return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
        <div className="skeleton" style={{ aspectRatio: '3/4' }} />
        <div><div className="skeleton" style={{ height: '30px', width: '60%', marginBottom: '16px' }} /><div className="skeleton" style={{ height: '200px' }} /></div>
      </div>
    </div>
  );

  if (!product) return <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}><h2>Product not found</h2><Link to="/products" className="btn btn-primary" style={{marginTop:16}}>Browse</Link></div>;

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const fastDelivery = product.deliveryZones?.some(z => z.estimatedMinutes <= 30);

  return (
    <div className="container" style={{ padding: '32px 24px 60px' }}>
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '24px', fontSize: '14px' }}>
        <ArrowBackIcon sx={{ fontSize: 18 }} /> Back to Shop
      </Link>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
        {/* Images */}
        <div>
          <motion.div key={selectedImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', aspectRatio: '3/4', background: 'var(--bg-card)', border: '1px solid var(--border)', marginBottom: '16px' }}>
            <img src={product.images?.[selectedImage] || 'https://placehold.co/600x800/1a1a25/9a9ab0?text=Image'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} style={{ width: '72px', height: '72px', borderRadius: 'var(--radius-md)', overflow: 'hidden', cursor: 'pointer', border: `2px solid ${i === selectedImage ? 'var(--accent)' : 'var(--border)'}`, opacity: i === selectedImage ? 1 : 0.6 }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Details */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-light)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>{product.brand}</div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '16px', lineHeight: 1.2 }}>{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <StarIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
              <span style={{ fontWeight: 700 }}>{product.rating}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>({product.reviewCount} reviews)</span>
            </div>
            {fastDelivery && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(34,197,94,0.1)', color: 'var(--success)', fontSize: '12px', fontWeight: 600 }}><LocalShippingOutlinedIcon sx={{ fontSize: 14 }} /> 20 min</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '36px', fontWeight: 800 }} className="gradient-text">₹{price.toLocaleString()}</span>
            {hasDiscount && <><span style={{ fontSize: '20px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{product.price.toLocaleString()}</span><span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'var(--gradient-gold)', color: 'white', fontSize: '13px', fontWeight: 700 }}>{Math.round((1 - product.discountPrice / product.price) * 100)}% OFF</span></>}
          </div>
          {product.isAvailableForRent && <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', marginBottom: '24px', fontSize: '13px', color: 'var(--info)' }}>🏷️ Rent at ₹{product.rentPricePerDay}/day — Coming Soon!</div>}
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '28px', fontSize: '15px' }}>{product.description}</p>
          {/* Colors */}
          {product.colors?.length > 0 && <div style={{ marginBottom: '24px' }}><label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>Color: <span style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{selectedColor}</span></label><div style={{ display: 'flex', gap: '8px' }}>{product.colors.map(c => <button key={c} onClick={() => setSelectedColor(c)} style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', background: selectedColor === c ? 'var(--accent-bg)' : 'var(--bg-elevated)', color: selectedColor === c ? 'var(--accent-light)' : 'var(--text-muted)', border: `1px solid ${selectedColor === c ? 'var(--accent)' : 'var(--border)'}`, fontSize: '13px', fontWeight: 600, textTransform: 'capitalize', cursor: 'pointer' }}>{c}</button>)}</div></div>}
          {/* Sizes */}
          <div style={{ marginBottom: '28px' }}><label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>Size {!selectedSize && <span style={{ color: 'var(--warning)', fontWeight: 400 }}>— Select</span>}</label><div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{product.sizes?.map(s => <button key={s.size} onClick={() => setSelectedSize(s.size)} disabled={s.stock <= 0} style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)', background: selectedSize === s.size ? 'var(--gradient-primary)' : 'var(--bg-elevated)', color: selectedSize === s.size ? 'white' : s.stock > 0 ? 'var(--text-primary)' : 'var(--text-muted)', border: `1px solid ${selectedSize === s.size ? 'transparent' : 'var(--border)'}`, fontSize: '14px', fontWeight: 600, cursor: s.stock > 0 ? 'pointer' : 'not-allowed', opacity: s.stock <= 0 ? 0.3 : 1 }}>{s.size}</button>)}</div></div>
          {/* Tags */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '28px' }}>{product.tags?.map(t => <span key={t} style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'var(--bg-card)', border: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{t}</span>)}</div>
          {/* Add to Cart */}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAdd} disabled={adding || !selectedSize} style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-lg)', background: added ? 'var(--success)' : !selectedSize ? 'var(--bg-elevated)' : 'var(--gradient-primary)', color: !selectedSize ? 'var(--text-muted)' : 'white', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: selectedSize ? 'pointer' : 'not-allowed', boxShadow: selectedSize && !added ? '0 4px 20px var(--accent-glow)' : 'none' }}>
            {added ? <><CheckCircleIcon /> Added!</> : adding ? 'Adding...' : <><ShoppingBagOutlinedIcon /> {selectedSize ? 'Add to Bag' : 'Select a Size'}</>}
          </motion.button>
          {/* Bundle */}
          {product.bundleCompatible?.length > 0 && <div style={{ marginTop: '32px' }}><h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>⚡ Complete the Look — <span className="gradient-text">15% Bundle</span></h3><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '12px' }}>{product.bundleCompatible.map(p => <Link key={p._id} to={`/products/${p._id}`} style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: '1px solid var(--border)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}><img src={p.images?.[0]} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} /><div><div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div><div style={{ fontSize: '12px', color: 'var(--accent-light)' }}>₹{p.price}</div></div></Link>)}</div></div>}
        </div>
      </div>
      <style>{`@media(max-width:768px){.container>div:nth-child(2){grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
