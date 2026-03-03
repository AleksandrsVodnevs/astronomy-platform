import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import BlackHoleLogo from '../components/BlackHoleLogo';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { t } = useLang();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const res = await login(formData); loginUser(res.data.token, res.data.user); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Pieteikšanās kļūda'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header"><span className="auth-icon"><BlackHoleLogo size={34} /></span><h1>{t('loginTitle')}</h1><p>{t('loginWelcome')}</p></div>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>{t('email')}</label><input type="email" name="email" placeholder={t('emailPlaceholder')} value={formData.email} onChange={handleChange} required /></div>
          <div className="form-group">
            <label>{t('password')}</label>
            <div className="password-wrap">
              <input type={showPassword ? 'text' : 'password'} name="password" placeholder={t('passwordPlaceholder')} value={formData.password} onChange={handleChange} required />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>
          <div className="auth-extras">
            <Link to="/aizmirsu-paroli" className="forgot-link">{t('forgotPassword')}</Link>
          </div>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>{loading ? t('loggingIn') : t('loginTitle')}</button>
        </form>
        <div className="auth-footer"><p>{t('noAccount')} <Link to="/registreties">{t('registerLink')}</Link></p></div>
      </div>
    </div>
  );
};
export default Login;
