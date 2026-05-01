import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
const NotFound = () => {
  const { t } = useLang();
  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔭</div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.5rem' }}>404</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t('notFoundTitle')}</p>
      <Link to="/" className="btn btn-primary">{t('backHome')}</Link>
    </div>
  );
};
export default NotFound;
