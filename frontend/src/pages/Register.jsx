import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, verifyRegistration, resendCode } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { t, lang } = useLang();

  const [step, setStep] = useState('form'); // 'form' | 'verify'
  const [pendingEmail, setPendingEmail] = useState('');
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [code, setCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return setError(lang === 'en' ? 'You must agree to the Terms and Privacy Policy' : 'Jums jāpiekrīt lietošanas noteikumiem');
    if (formData.password !== formData.confirmPassword) return setError(lang === 'en' ? 'Passwords do not match' : 'Paroles nesakrīt');
    if (formData.password.length < 8) return setError(lang === 'en' ? 'Password too short (min. 8 characters)' : 'Parole pārāk īsa (min. 8 simboli)');
    setLoading(true);
    try {
      await register(formData);
      setPendingEmail(formData.email);
      setStep('verify');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Kļūda');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return setError(lang === 'en' ? 'Enter the 6-digit code' : 'Ievadiet 6 ciparu kodu');
    setLoading(true);
    try {
      const res = await verifyRegistration(pendingEmail, code);
      loginUser(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Kļūda');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendCode(pendingEmail, 'register');
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      const wait = err.response?.data?.wait;
      if (wait) {
        setResendCooldown(wait);
        const interval = setInterval(() => {
          setResendCooldown(prev => {
            if (prev <= 1) { clearInterval(interval); return 0; }
            return prev - 1;
          });
        }, 1000);
      }
      setError(err.response?.data?.message || 'Kļūda');
    } finally {
      setResendLoading(false);
    }
  };

  // ── Verification step ──
  if (step === 'verify') {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-icon">
              <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
                <ellipse cx="50" cy="50" rx="38" ry="8" fill="none" stroke="#a0b8ff" strokeWidth="3" opacity="0.7"/>
                <circle cx="50" cy="50" r="22" fill="#0a0e1a"/>
                <circle cx="50" cy="50" r="18" fill="#050810"/>
                <circle cx="50" cy="50" r="19" fill="none" stroke="#6b8ef5" strokeWidth="1.5" opacity="0.8"/>
              </svg>
            </span>
            <h1>{lang === 'en' ? 'Verify Email' : 'Apstiprināt e-pastu'}</h1>
            <p>{lang === 'en' ? `We sent a 6-digit code to ${pendingEmail}` : `Nosūtījām 6 ciparu kodu uz ${pendingEmail}`}</p>
          </div>
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label>{lang === 'en' ? 'Verification code' : 'Verifikācijas kods'}</label>
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                style={{ fontSize: '1.4rem', textAlign: 'center', letterSpacing: '0.4rem', fontWeight: 700 }}
                autoFocus
              />
            </div>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? '...' : (lang === 'en' ? 'Confirm' : 'Apstiprināt')}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '1.2rem' }}>
            {resendCooldown > 0 ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {lang === 'en' ? `Resend in ${resendCooldown}s` : `Atkārtoti nosūtīt pēc ${resendCooldown}s`}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.88rem' }}
              >
                {resendLoading ? '...' : (lang === 'en' ? 'Resend code' : 'Nosūtīt kodu atkārtoti')}
              </button>
            )}
          </div>
          <div className="auth-footer">
            <button type="button" onClick={() => { setStep('form'); setCode(''); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.88rem' }}>
              {lang === 'en' ? '← Back to registration' : '← Atpakaļ uz reģistrāciju'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration form ──
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
              <ellipse cx="50" cy="50" rx="42" ry="11" fill="none" stroke="#7c9ef5" strokeWidth="1.5" opacity="0.5"/>
              <ellipse cx="50" cy="50" rx="38" ry="8" fill="none" stroke="#a0b8ff" strokeWidth="3" opacity="0.7"/>
              <circle cx="50" cy="50" r="22" fill="#0a0e1a"/>
              <circle cx="50" cy="50" r="18" fill="#050810"/>
              <circle cx="50" cy="50" r="19" fill="none" stroke="#6b8ef5" strokeWidth="1.5" opacity="0.8"/>
              <ellipse cx="50" cy="50" rx="38" ry="8" fill="none" stroke="#c0d0ff" strokeWidth="2.5" strokeDasharray="120 240" strokeDashoffset="60" opacity="0.9"/>
            </svg>
          </span>
          <h1>{t('registerTitle')}</h1>
          <p>{t('registerWelcome')}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>{t('firstName')}</label>
              <input type="text" name="firstName" placeholder={t('firstNamePlaceholder')} value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>{t('lastName')}</label>
              <input type="text" name="lastName" placeholder={t('lastNamePlaceholder')} value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>{t('email')}</label>
            <input type="email" name="email" placeholder={t('emailPlaceholder')} value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>{t('createPassword')}</label>
            <div className="password-wrap">
              <input type={showPassword ? 'text' : 'password'} name="password" placeholder={t('minChars')} value={formData.password} onChange={handleChange} required />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(p => !p)}>
                {showPassword ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>{t('confirmPassword')}</label>
            <div className="password-wrap">
              <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" placeholder={t('repeatPassword')} value={formData.confirmPassword} onChange={handleChange} required />
              <button type="button" className="eye-btn" onClick={() => setShowConfirm(p => !p)}>
                {showConfirm ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
              </button>
            </div>
          </div>
          <div className="terms-check">
            <input type="checkbox" id="terms" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setError(''); }} />
            <label htmlFor="terms">
              {lang === 'en' ? (<>I agree to the <Link to="/noteikumi" target="_blank">Terms of Use</Link> and <Link to="/privatums" target="_blank">Privacy Policy</Link></>) : (<>Piekrītu <Link to="/noteikumi" target="_blank">lietošanas noteikumiem</Link> un <Link to="/privatums" target="_blank">privātuma politikai</Link></>)}
            </label>
          </div>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading || !agreed}>
            {loading ? '...' : t('registerTitle')}
          </button>
        </form>
        <div className="auth-footer">
          <p>{t('hasAccount')} <Link to="/pieteikties">{t('loginLink')}</Link></p>
        </div>
      </div>
    </div>
  );
};
export default Register;
