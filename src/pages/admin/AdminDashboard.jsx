import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import LaunchIcon from '@mui/icons-material/Launch';
import api from '../../api/index';

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    try {
      const res = await api.get('/admin/sellers');
      setApplications(res.data.applications);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to load applications. Make sure you are an admin.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/admin/sellers/${id}`, { status });
      // Refresh the list seamlessly
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  const getFileUrl = (path) => {
    // Convert backslashes to forward slashes for URLs, just in case
    const safePath = path.replace(/\\/g, '/');
    return `http://localhost:5000/${safePath}`;
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: '100px 24px 60px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '8px' }}>Manage user seller applications and store approvals</p>
      </div>

      {error ? (
        <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: 'var(--radius-md)', fontWeight: 500 }}>
          {error}
        </div>
      ) : applications.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No seller applications currently found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {applications.map((app, i) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: 'var(--bg-card)', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius-lg)', 
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', m: 0 }}>{app.storeName}</h2>
                    <span style={{
                      padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                      background: app.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : app.status === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: app.status === 'approved' ? '#10b981' : app.status === 'rejected' ? '#ef4444' : '#f59e0b',
                    }}>
                      {app.status}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                    Applied by: <span style={{ color: 'var(--text-primary)' }}>{app.userId?.name}</span> ({app.userId?.email})
                  </p>
                </div>
                
                <a 
                  href={getFileUrl(app.documentPath)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600,
                    color: 'var(--accent)', background: 'var(--bg-elevated)', padding: '8px 16px',
                    borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', textDecoration: 'none'
                  }}
                >
                  <LaunchIcon sx={{ fontSize: 16 }} /> View Document
                </a>
              </div>

              <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', display: 'grid', gap: '16px', background: 'var(--bg-elevated)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Description</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>{app.description}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Business Address</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>{app.address}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Category</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px', textTransform: 'capitalize' }}>{app.categories}</p>
                </div>
              </div>

              {app.status === 'pending' && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    onClick={() => handleUpdateStatus(app._id, 'approved')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: '#10b981', color: 'white', border: 'none', padding: '10px 20px',
                      borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
                    }}
                  >
                    <CheckCircleOutlineIcon sx={{ fontSize: 18 }} /> Approve Store
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(app._id, 'rejected')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '10px 20px',
                      borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 18 }} /> Reject Let
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
