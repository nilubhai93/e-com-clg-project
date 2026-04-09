import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import api from '../../api/index';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await api.get('/seller/dashboard/products');
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await api.patch(`/seller/dashboard/products/\${id}/toggle`);
      fetchProducts(); // refresh
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}><CircularProgress sx={{ color: 'var(--accent)' }}/></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>My Products</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Manage your inventory and visibility</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '8px 16px', width: '300px' }}>
          <SearchIcon sx={{ color: 'var(--text-muted)', fontSize: 20 }} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', color: 'var(--text-primary)', fontSize: '14px', marginLeft: '8px', width: '100%' }}
          />
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Item</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Price</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Stock</th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s', ':hover': { background: 'var(--bg-elevated)' } }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={product.images[0]} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{product.name}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{product.brand} &bull; {product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-primary)', fontWeight: 600 }}>${product.price.toFixed(2)}</td>
                  <td style={{ padding: '16px', color: 'var(--text-primary)' }}>{product.sizes[0]?.stock || 0}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                      background: product.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: product.isActive ? '#10b981' : '#ef4444'
                    }}>
                      {product.isActive ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button 
                      title={product.isActive ? "Hide Product" : "Publish Product"}
                      onClick={() => handleToggleStatus(product._id)}
                      style={{ background: 'transparent', border: '1px solid var(--border)', padding: '8px', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', cursor: 'pointer', marginRight: '8px' }}
                    >
                      {product.isActive ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                    </button>
                    {/* Placeholder for Edit functionality */}
                    <button 
                      title="Edit Product"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '8px', borderRadius: 'var(--radius-md)', color: 'var(--accent)', cursor: 'pointer' }}
                    >
                      <EditIcon sx={{ fontSize: 18 }} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
