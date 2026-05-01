import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
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
        <div className="auth-header"><span className="auth-icon">🔭</span><h1>{t('loginTitle')}</h1><p>{t('loginWelcome')}</p></div>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>{t('email')}</label><input type="email" name="email" placeholder={t('emailPlaceholder')} value={formData.email} onChange={handleChange} required /></div>
          <div className="form-group">
            <label>{t('password')}</label>
            <div className="password-wrap">
              <input type={showPassword ? 'text' : 'password'} name="password" placeholder={t('passwordPlaceholder')} value={formData.password} onChange={handleChange} required />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁'}</button>
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
