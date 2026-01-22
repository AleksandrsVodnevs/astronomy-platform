import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';
import { useLang } from '../context/LanguageContext';
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
          <span className="auth-icon">🔑</span>
          <h1>{t('forgotTitle')}</h1>
          <p>{t('forgotSubtitle')}</p>
        </div>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
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
