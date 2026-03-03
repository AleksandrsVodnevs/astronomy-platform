import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
const NotFound = () => {
  const { t } = useLang();
  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1.5rem', opacity: 0.5 }}>
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v3M11 14h.01"/>
      </svg>
      <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: '0.5rem', lineHeight: 1 }}>404</h1>
      <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t('notFoundTitle')}</p>
      <Link to="/" className="btn btn-primary">{t('backHome')}</Link>
    </div>
  );
};
export default NotFound;
