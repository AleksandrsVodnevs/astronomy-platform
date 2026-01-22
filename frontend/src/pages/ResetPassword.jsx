import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';
import { useLang } from '../context/LanguageContext';
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
        <div className="auth-header"><span className="auth-icon">🔐</span><h1>{t('resetTitle')}</h1><p>{t('resetSubtitle')}</p></div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('newPassword')}</label>
            <div className="password-wrap">
              <input type={showPw ? 'text' : 'password'} placeholder={t('minChars')} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} required />
              <button type="button" className="eye-btn" onClick={() => setShowPw(!showPw)}>{showPw ? '🙈' : '👁'}</button>
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
