import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';
import { useLang } from '../context/LanguageContext';
import BlackHoleLogo from '../components/BlackHoleLogo';
import './Auth.css';

const ForgotPassword = () => {
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Kļūda. Mēģiniet vēlāk.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon"><BlackHoleLogo size={34} /></span>
          <h1>{t('forgotTitle')}</h1>
          <p>{t('forgotSubtitle')}</p>
        </div>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.75">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M2 7l10 7 10-7"/>
              </svg>
            </div>
            <p style={{ color: 'var(--success)', marginBottom: '1.5rem' }}>Pārbaudiet savu e-pastu un spiediet nosūtīto saiti!</p>
            <Link to="/pieteikties" className="btn btn-secondary" style={{ display: 'inline-flex' }}>{t('backToLogin')}</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t('email')}</label>
              <input type="email" placeholder={t('emailPlaceholder')} value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} required />
            </div>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? t('sending') : t('sendLink')}
            </button>
          </form>
        )}
        <div className="auth-footer"><Link to="/pieteikties">{t('backToLogin')}</Link></div>
      </div>
    </div>
  );
};
export default ForgotPassword;
