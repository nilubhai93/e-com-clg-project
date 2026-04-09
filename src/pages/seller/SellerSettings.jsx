import { motion } from 'framer-motion';
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';

export default function SellerSettings() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', paddingTop: '60px' }}>
      
      <div style={{ display: 'inline-flex', padding: '24px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '50%', color: 'var(--accent)', marginBottom: '24px' }}>
        <BuildCircleOutlinedIcon sx={{ fontSize: 64 }} />
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: '8px' }}>Store Settings</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto' }}>
        We're currently building out advanced store customization tools! Check back soon to set up your payout accounts, store policies, and custom branding.
      </p>
      
    </motion.div>
  );
}
