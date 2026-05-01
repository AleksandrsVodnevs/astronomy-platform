import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { updateMe, uploadAvatar, requestEmailChange, confirmEmailChange, changePassword, deleteAccount, resendCode } from '../services/api';
import Avatar from '../components/Avatar';
import './Profile.css';

// ── Feedback component defined OUTSIDE Profile to prevent remount bug ─────────
const Feedback = ({ m }) => m?.text ? (
  <div style={{ fontSize: '0.85rem', color: m.type === 'success' ? 'var(--success)' : 'var(--error)', margin: '0.6rem 0' }}>
    {m.text}
  </div>
) : null;

const Profile = () => {
  const { user, loginUser, logoutUser } = useAuth();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const fileRef = useRef();

  // Profile fields
  const [profileForm, setProfileForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', bio: user?.bio || '', location: user?.location || '', website: user?.website || '', interests: user?.interests || '' });
  const [profileMsg, setProfileMsg] = useState(null);

  // Email change — 2 steps
  const [emailStep, setEmailStep] = useState('form'); // 'form' | 'verify'
  const [emailForm, setEmailForm] = useState({ email: '', password: '' });
  const [emailCode, setEmailCode] = useState('');
  const [emailMsg, setEmailMsg] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete account
  const [showDelete, setShowDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteMsg, setDeleteMsg] = useState(null);

  // Avatar
  const [avatarLoading, setAvatarLoading] = useState(false);

  const setMsg = useCallback((setter, type, text) => {
    setter({ type, text });
    setTimeout(() => setter(null), 5000);
  }, []);

  const startResendTimer = useCallback((seconds) => {
    setResendCooldown(seconds);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // ── Profile submit ──
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateMe(profileForm);
      loginUser(localStorage.getItem('token'), { ...user, ...res.data });
      setMsg(setProfileMsg, 'success', lang === 'en' ? 'Profile updated' : 'Profils atjaunināts');
    } catch (err) { setMsg(setProfileMsg, 'error', err.response?.data?.message || 'Kļūda'); }
  };

  // ── Avatar ──
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await uploadAvatar(fd);
      loginUser(localStorage.getItem('token'), { ...user, avatar: res.data.avatar });
      setMsg(setProfileMsg, 'success', lang === 'en' ? 'Photo updated' : 'Foto atjaunināts');
    } catch (err) { setMsg(setProfileMsg, 'error', err.response?.data?.message || 'Kļūda'); }
    finally { setAvatarLoading(false); }
  };

  // ── Email step 1: request ──
  const handleEmailRequest = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    try {
      await requestEmailChange(emailForm);
      setEmailStep('verify');
      setEmailMsg(null);
      startResendTimer(60);
    } catch (err) { setMsg(setEmailMsg, 'error', err.response?.data?.message || 'Kļūda'); }
    finally { setEmailLoading(false); }
  };

  // ── Email step 2: confirm ──
  const handleEmailConfirm = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    try {
      const res = await confirmEmailChange(emailCode);
      loginUser(localStorage.getItem('token'), { ...user, email: res.data.email });
      setEmailStep('form');
      setEmailForm({ email: '', password: '' });
      setEmailCode('');
      setMsg(setEmailMsg, 'success', lang === 'en' ? 'Email updated successfully' : 'E-pasts veiksmīgi mainīts');
    } catch (err) { setMsg(setEmailMsg, 'error', err.response?.data?.message || 'Kļūda'); }
    finally { setEmailLoading(false); }
  };

  // ── Resend email code ──
  const handleResendEmailCode = async () => {
    try {
      await resendCode(emailForm.email, 'email_change');
      startResendTimer(60);
    } catch (err) {
      const wait = err.response?.data?.wait;
      if (wait) startResendTimer(wait);
      setMsg(setEmailMsg, 'error', err.response?.data?.message || 'Kļūda');
    }
  };

  // ── Password change ──
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setMsg(setPasswordMsg, 'error', lang === 'en' ? 'Passwords do not match' : 'Paroles nesakrīt');
    if (newPassword.length < 8) return setMsg(setPasswordMsg, 'error', 'Min. 8 simboli');
    setPasswordLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setMsg(setPasswordMsg, 'success', lang === 'en' ? 'Password changed' : 'Parole mainīta');
    } catch (err) { setMsg(setPasswordMsg, 'error', err.response?.data?.message || 'Kļūda'); }
    finally { setPasswordLoading(false); }
  };

  // ── Delete account ──
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      await deleteAccount(deletePassword);
      logoutUser();
      navigate('/');
    } catch (err) { setMsg(setDeleteMsg, 'error', err.response?.data?.message || 'Kļūda'); }
  };

  const EyeOff = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
  const EyeOn = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '660px' }}>
      <div className="page-header"><h1>{t('profileTitle')}</h1><p>{t('profileSubtitle')}</p></div>

      {/* Avatar card */}
      <div className="card profile-avatar-card">
        <div className="profile-avatar-section">
          <div className="profile-avatar-wrap">
            <Avatar user={user} size={80} />
            <button className="avatar-upload-btn" onClick={() => fileRef.current.click()} disabled={avatarLoading}>
              {avatarLoading ? '...' : (lang === 'en' ? 'Change photo' : 'Mainīt foto')}
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>
          <div className="profile-info">
            <div className="profile-name">{user?.firstName} {user?.lastName}</div>
            <div className="profile-email">{user?.email}</div>
            <span className={`badge badge-${user?.role === 'admin' ? 'admin' : 'user'}`}>
              {user?.role === 'admin' ? t('roleAdmin') : t('roleUser')}
            </span>
          </div>
        </div>
        <Feedback m={profileMsg} />
      </div>

      {/* Edit profile */}
      <div className="card profile-section-card">
        <h2 className="profile-section-title">{t('editProfile')}</h2>
        <form onSubmit={handleProfileSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label>{t('firstName')}</label><input type="text" value={profileForm.firstName} onChange={(e) => setProfileForm(p => ({...p, firstName: e.target.value}))} required /></div>
            <div className="form-group"><label>{t('lastName')}</label><input type="text" value={profileForm.lastName} onChange={(e) => setProfileForm(p => ({...p, lastName: e.target.value}))} required /></div>
          </div>
          <div className="form-group"><label>{lang === 'en' ? 'Bio' : 'Par sevi'}</label><textarea value={profileForm.bio} onChange={(e) => setProfileForm(p => ({...p, bio: e.target.value}))} rows={3} maxLength={300} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label>{lang === 'en' ? 'Location' : 'Atrašanās vieta'}</label><input type="text" value={profileForm.location} onChange={(e) => setProfileForm(p => ({...p, location: e.target.value}))} placeholder="Rīga" /></div>
            <div className="form-group"><label>{lang === 'en' ? 'Website' : 'Vietne'}</label><input type="url" value={profileForm.website} onChange={(e) => setProfileForm(p => ({...p, website: e.target.value}))} placeholder="https://" /></div>
          </div>
          <div className="form-group"><label>{lang === 'en' ? 'Interests' : 'Intereses'}</label><input type="text" value={profileForm.interests} onChange={(e) => setProfileForm(p => ({...p, interests: e.target.value}))} placeholder={lang === 'en' ? 'Planets, Astrophotography...' : 'Planētas, Astrofotogrāfija...'} /></div>
          <button type="submit" className="btn btn-primary">{t('saveChanges')}</button>
        </form>
      </div>

      {/* Change email */}
      <div className="card profile-section-card">
        <h2 className="profile-section-title">{lang === 'en' ? 'Change Email' : 'Mainīt e-pastu'}</h2>
        {emailStep === 'form' ? (
          <form onSubmit={handleEmailRequest}>
            <div className="form-group">
              <label>{lang === 'en' ? 'New email address' : 'Jaunā e-pasta adrese'}</label>
              <input type="email" value={emailForm.email} onChange={(e) => setEmailForm(p => ({...p, email: e.target.value}))} required />
            </div>
            <div className="form-group">
              <label>{lang === 'en' ? 'Confirm with current password' : 'Apstiprināt ar pašreizējo paroli'}</label>
              <input type="password" value={emailForm.password} onChange={(e) => setEmailForm(p => ({...p, password: e.target.value}))} required />
            </div>
            <Feedback m={emailMsg} />
            <button type="submit" className="btn btn-primary" disabled={emailLoading}>
              {emailLoading ? '...' : (lang === 'en' ? 'Send verification code' : 'Nosūtīt verifikācijas kodu')}
            </button>
          </form>
        ) : (
          <div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              {lang === 'en' ? `Enter the 6-digit code sent to ${emailForm.email}` : `Ievadiet 6 ciparu kodu, kas nosūtīts uz ${emailForm.email}`}
            </p>
            <form onSubmit={handleEmailConfirm}>
              <div className="form-group">
                <label>{lang === 'en' ? 'Verification code' : 'Verifikācijas kods'}</label>
                <input type="text" maxLength={6} value={emailCode} onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))} style={{ fontSize: '1.3rem', textAlign: 'center', letterSpacing: '0.4rem', fontWeight: 700 }} autoFocus />
              </div>
              <Feedback m={emailMsg} />
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button type="submit" className="btn btn-primary" disabled={emailLoading}>
                  {emailLoading ? '...' : (lang === 'en' ? 'Confirm' : 'Apstiprināt')}
                </button>
                {resendCooldown > 0 ? (
                  <span style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                    {lang === 'en' ? `Resend in ${resendCooldown}s` : `Atkārtoti pēc ${resendCooldown}s`}
                  </span>
                ) : (
                  <button type="button" onClick={handleResendEmailCode} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.88rem' }}>
                    {lang === 'en' ? 'Resend code' : 'Nosūtīt atkārtoti'}
                  </button>
                )}
                <button type="button" onClick={() => { setEmailStep('form'); setEmailCode(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.83rem' }}>
                  {lang === 'en' ? 'Cancel' : 'Atcelt'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Change password */}
      <div className="card profile-section-card">
        <h2 className="profile-section-title">{lang === 'en' ? 'Change Password' : 'Mainīt paroli'}</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label>{lang === 'en' ? 'Current password' : 'Pašreizējā parole'}</label>
            <div className="password-wrap">
              <input type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              <button type="button" className="eye-btn" onClick={() => setShowCurrent(p => !p)}>{showCurrent ? <EyeOff /> : <EyeOn />}</button>
            </div>
          </div>
          <div className="form-group">
            <label>{lang === 'en' ? 'New password' : 'Jaunā parole'}</label>
            <div className="password-wrap">
              <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 8 simboli" required />
              <button type="button" className="eye-btn" onClick={() => setShowNew(p => !p)}>{showNew ? <EyeOff /> : <EyeOn />}</button>
            </div>
          </div>
          <div className="form-group">
            <label>{lang === 'en' ? 'Confirm new password' : 'Apstiprināt jauno paroli'}</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <Feedback m={passwordMsg} />
          <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
            {passwordLoading ? '...' : (lang === 'en' ? 'Change Password' : 'Mainīt paroli')}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="card profile-section-card danger-zone-card">
        <h2 className="profile-section-title danger-zone-title">
          {lang === 'en' ? 'Danger Zone' : 'Bīstamā zona'}
        </h2>

        {!showDelete ? (
          <div className="danger-zone-row">
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.2rem' }}>
                {lang === 'en' ? 'Delete Account' : 'Dzēst kontu'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {lang === 'en' ? 'Permanently delete your account and all your content.' : 'Neatgriezeniski dzēst kontu un visu jūsu saturu.'}
              </div>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => setShowDelete(true)}>
              {lang === 'en' ? 'Delete Account' : 'Dzēst kontu'}
            </button>
          </div>
        ) : (
          <div className="delete-confirm-box">
            <div className="delete-warning">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div>
                <strong>{lang === 'en' ? 'This action is permanent and cannot be undone.' : 'Šī darbība ir neatgriezeniska.'}</strong>
                <div style={{ fontSize: '0.82rem', marginTop: '0.3rem' }}>
                  {lang === 'en'
                    ? 'Your account, all forum posts, and comments will be permanently deleted.'
                    : 'Jūsu konts, visi foruma ieraksti un komentāri tiks neatgriezeniski dzēsti.'}
                </div>
              </div>
            </div>

            <form onSubmit={handleDeleteAccount}>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>
                  {lang === 'en' ? 'Enter your current password to confirm deletion:' : 'Ievadiet pašreizējo paroli, lai apstiprinātu dzēšanu:'}
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder={lang === 'en' ? 'Your password' : 'Jūsu parole'}
                  required
                  autoFocus
                />
              </div>
              <Feedback m={deleteMsg} />
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-danger" disabled={!deletePassword}>
                  {lang === 'en' ? 'Permanently delete my account' : 'Neatgriezeniski dzēst manu kontu'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { setShowDelete(false); setDeletePassword(''); setDeleteMsg(null); }}
                >
                  {lang === 'en' ? 'Cancel' : 'Atcelt'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default Profile;
