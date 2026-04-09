import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api/index';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CloseIcon from '@mui/icons-material/Close';

export default function AddProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    stock: '',
    gender: 'unisex',
    description: ''
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 4); // Max 4 images
      setFiles(selectedFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submitData = new FormData();
    Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
    files.forEach(file => submitData.append('images', file));

    try {
      await api.post('/seller/dashboard/products', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/seller/products');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add product');
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-md)',
    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', fontSize: '15px', outline: 'none',
    transition: 'border var(--transition-fast)'
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Add New Product</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>List an item in your store's catalog</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
        {error && <div style={{ padding: '14px', marginBottom: '24px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: 'var(--radius-md)', fontWeight: 500 }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Product Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Classic Denim Jacket" style={inputStyle} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Brand</label>
            <input required name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Levi's" style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Category</label>
            <select required name="category" value={formData.category} onChange={handleChange} style={{ ...inputStyle, appearance: 'none' }}>
              <option value="" disabled>Select category</option>
              <option value="dress">Dress</option>
              <option value="shirt">Shirt</option>
              <option value="jeans">Jeans</option>
              <option value="tshirt">T-Shirt</option>
              <option value="jacket">Jacket</option>
              <option value="shoes">Shoes</option>
              <option value="accessory">Accessory</option>
              <option value="bag">Bag</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Price ($)</label>
            <input required type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Initial Stock</label>
            <input required type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} placeholder="e.g. 50" style={inputStyle} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Target Gender</label>
            <div style={{ display: 'flex', gap: '16px' }}>
              {['unisex', 'men', 'women'].map(g => (
                <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} />
                  <span style={{ textTransform: 'capitalize' }}>{g}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} placeholder="Describe the item's material, fit, etc." rows="4" style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Product Images (Up to 4)</label>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: '40px 20px', textAlign: 'center', cursor: 'pointer',
                background: 'var(--bg-elevated)', transition: 'all var(--transition-fast)'
              }}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" multiple />
              <CloudUploadOutlinedIcon sx={{ fontSize: 32, color: 'var(--text-muted)' }} />
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px', marginTop: '12px' }}>Click to upload images</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>JPG, PNG, WebP (max 5MB each)</p>
            </div>

            {files.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                {files.map((file, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-elevated)', padding: '6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-primary)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                    <CloseIcon sx={{ fontSize: 14, color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setFiles(files.filter((_, idx) => idx !== i))} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button type="button" onClick={() => navigate('/seller')} style={{ background: 'transparent', border: '1px solid var(--border)', padding: '12px 24px', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button type="submit" disabled={loading} style={{ background: 'var(--gradient-primary)', color: 'white', border: 'none', padding: '12px 32px', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Adding...' : 'List Product'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
