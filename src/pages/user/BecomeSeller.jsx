import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import ScheduleIcon from '@mui/icons-material/Schedule';
import api from '../../api/index';

export default function BecomeSeller() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    address: '',
    categories: ''
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [existingApp, setExistingApp] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/seller/status');
        if (res.data && res.data.application) {
          setExistingApp(res.data.application);
        }
      } catch (err) {
        // Expected if no application exists
      } finally {
        setIsLoadingStatus(false);
      }
    };
    fetchStatus();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formPayload = new FormData();
    formPayload.append('storeName', formData.storeName);
    formPayload.append('description', formData.description);
    formPayload.append('address', formData.address);
    formPayload.append('categories', formData.categories);
    formPayload.append('document', file);

    try {
      await api.post('/seller/apply', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to submit application. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoadingStatus) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  // --- SHOW SUCCESS AFTER JUST SUBMITTING OR IF EXISTING APP EXISTS ---
  if (isSuccess || existingApp) {
    const appData = existingApp || formData;
    const isApproved = existingApp?.status === 'approved';
    const isRejected = existingApp?.status === 'rejected';

    return (
      <div style={{ minHeight: '80vh', padding: '100px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'var(--bg-card)', padding: '50px 40px', borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)', maxWidth: '500px', width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '32px' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, delay: 0.1 }}
              style={{ 
                width: '72px', height: '72px', borderRadius: '50%', 
                background: isApproved ? 'rgba(16, 185, 129, 0.1)' : isRejected ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                border: `2px solid ${isApproved ? 'rgba(16, 185, 129, 0.4)' : isRejected ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
              }}
            >
              {isApproved ? <CheckCircleOutlineIcon sx={{ fontSize: 36, color: '#10b981' }} /> : 
               isRejected ? <CloseIcon sx={{ fontSize: 36, color: '#ef4444' }} /> : 
               <ScheduleIcon sx={{ fontSize: 36, color: '#f59e0b' }} />}
            </motion.div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
              {isSuccess ? 'Application Submitted' : 'Application Status'}
            </h2>
            <div style={{
              display: 'inline-block', padding: '6px 14px', borderRadius: 'var(--radius-full)',
              background: isApproved ? 'rgba(16, 185, 129, 0.15)' : isRejected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: isApproved ? '#10b981' : isRejected ? '#ef4444' : '#f59e0b',
              fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px'
            }}>
              {existingApp?.status || 'Pending Review'}
            </div>
          </div>

          <div style={{ 
            background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', padding: '24px',
            border: '1px solid var(--border)', marginBottom: '32px'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              Store Overview
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '4px' }}>Store Name</p>
                <p style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 500 }}>{appData.storeName}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '4px' }}>Address</p>
                <p style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 500 }}>{appData.address}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '4px' }}>Category</p>
                <p style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 500, textTransform: 'capitalize' }}>{appData.categories}</p>
              </div>
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '32px', textAlign: 'center' }}>
            {isSuccess 
              ? "Thanks for your interest in becoming a seller! Our team will review your details and documents. You'll receive an email update within 48 hours."
              : existingApp?.status === 'pending'
              ? "We have received your application and it is currently undergoing review. We will notify you via email shortly."
              : existingApp?.status === 'approved'
              ? "Congratulations! Your store is approved. The seller dashboard features will be unlocked soon."
              : "Unfortunately, your application was not approved at this time."}
          </p>
          <button 
            onClick={() => navigate(isApproved ? '/seller' : '/shop')}
            className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px' }}
          >
            {isApproved ? 'Go to Seller Dashboard' : 'Return to Home'}
          </button>
        </motion.div>
      </div>
    );
  }

  // --- FORM VIEW ---
  return (
    <div id="become-seller-container" style={{ minHeight: '80vh', padding: '100px 24px 60px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <motion.div
          id="become-seller-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: '40px',
            border: '1px solid var(--border)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ 
              width: '56px', height: '56px', borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 16px var(--accent-glow)'
            }}>
              <StorefrontOutlinedIcon sx={{ fontSize: 28, color: 'white' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Become a Seller</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Join our platform and reach thousands of customers</p>
            </div>
          </div>

          {error && (
            <div style={{ padding: '14px', marginBottom: '24px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Store Name */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Store Name</label>
              <input
                required
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                placeholder="e.g., Trendy Styles Boutique"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: '15px', outline: 'none',
                  transition: 'border var(--transition-fast)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Store Description</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What kind of fashion items will you be selling?"
                rows="3"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: '15px', outline: 'none', resize: 'vertical',
                  transition: 'border var(--transition-fast)', fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Address */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Business Address</label>
              <input
                required
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address of your business"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: '15px', outline: 'none',
                  transition: 'border var(--transition-fast)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Categories */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Primary Category</label>
              <select
                required
                name="categories"
                value={formData.categories}
                onChange={handleChange}
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: '15px', outline: 'none', cursor: 'pointer',
                  appearance: 'none'
                }}
              >
                <option value="" disabled>Select a category</option>
                <option value="clothing">Clothing & Apparel</option>
                <option value="shoes">Footwear & Shoes</option>
                <option value="accessories">Accessories & Jewelry</option>
                <option value="beauty">Beauty & Makeup</option>
              </select>
            </div>

            {/* File Upload / Dropzone */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Business Document or ID Proof
              </label>
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)',
                  padding: '40px 20px', textAlign: 'center', cursor: 'pointer',
                  background: 'var(--bg-elevated)', transition: 'all var(--transition-fast)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-light)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => setFile(e.target.files?.[0])}
                  style={{ display: 'none' }} 
                  accept=".pdf,.jpg,.png"
                />
                
                {file ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', color: 'var(--success)' }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: 32 }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{file.name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      style={{ 
                        position: 'absolute', top: '12px', right: '12px', background: 'var(--bg-card)', 
                        border: '1px solid var(--border)', borderRadius: '50%', width: '28px', height: '28px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer',
                        zIndex: 10
                      }}
                    ><CloseIcon sx={{ fontSize: 16 }} /></button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '50%', color: 'var(--accent-light)' }}>
                      <CloudUploadOutlinedIcon sx={{ fontSize: 32 }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>Click to upload or drag and drop</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>PDF, PNG, or JPG (max. 5MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '16px' }}>
              <button 
                type="submit" 
                disabled={isSubmitting || !file}
                className="btn btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: 700, letterSpacing: '0.5px', opacity: (!file || isSubmitting) ? 0.5 : 1, cursor: (!file || isSubmitting) ? 'not-allowed' : 'pointer' }}
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', marginTop: '16px' }}>
                By submitting this form, you agree to our Seller Terms and Policies.
              </p>
            </div>
          </form>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #become-seller-container { padding: 80px 16px 40px !important; }
          #become-seller-card { padding: 24px !important; }
        }
      `}</style>
    </div>
  );
}
