import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';
import { useLang } from '../context/LanguageContext';
import BlackHoleLogo from '../components/BlackHoleLogo';
import './Auth.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { t } = useLang();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError('Paroles nesakrīt');
    if (password.length < 8) return setError('Parole ir pārāk īsa (min. 8 simboli)');
    setLoading(true);
    try {
      await resetPassword(token, password);
      navigate('/pieteikties');
    } catch (err) {
      setError(err.response?.data?.message || 'Kļūda. Saite var būt novecojusi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header"><span className="auth-icon"><BlackHoleLogo size={34} /></span><h1>{t('resetTitle')}</h1><p>{t('resetSubtitle')}</p></div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('newPassword')}</label>
            <div className="password-wrap">
              <input type={showPw ? 'text' : 'password'} placeholder={t('minChars')} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} required />
              <button type="button" className="eye-btn" onClick={() => setShowPw(!showPw)}>
                {showPw
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>{t('confirmNewPassword')}</label>
            <input type="password" placeholder={t('repeatPassword')} value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(''); }} required />
          </div>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? t('resetting') : t('resetButton')}
          </button>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;
