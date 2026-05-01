import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import BlackHoleLogo from './BlackHoleLogo';
import Avatar from './Avatar';
import './Navbar.css';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { lang, toggleLang, t } = useLang();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/forums?search=${encodeURIComponent(search.trim())}`); setSearch(''); }
  };
  const handleLogout = () => { logoutUser(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <BlackHoleLogo size={28} />
          <span className="navbar-title">AstroLV</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">{t('home')}</Link>
          <Link to="/zinas" className="nav-link">{t('news')}</Link>
          <Link to="/forums" className="nav-link">{t('forum')}</Link>
          <Link to="/materiali" className="nav-link">{t('materials')}</Link>
        </div>
        <form className="navbar-search" onSubmit={handleSearch}>
          <input type="text" placeholder={t('search')} value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="submit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
        </form>
        <button className="lang-toggle" onClick={toggleLang}>
          {lang === 'lv' ? 'LV' : 'EN'}
        </button>
        <div className="navbar-auth">
          {user ? (
            <div className="navbar-user">
              <Link to="/profils" className="navbar-user-link">
                <Avatar user={user} size={32} />
                <span className="navbar-username">{user.firstName}</span>
              </Link>
              {user.role === 'admin' && <Link to="/admin" className="nav-link admin-link">{t('admin')}</Link>}
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>{t('logout')}</button>
            </div>
          ) : (
            <div className="navbar-auth-buttons">
              <Link to="/pieteikties" className="btn btn-secondary btn-sm">{t('login')}</Link>
              <Link to="/registreties" className="btn btn-primary btn-sm">{t('register')}</Link>
            </div>
          )}
        </div>
        <button className="navbar-burger" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>
      </div>
      {menuOpen && (
        <div className="navbar-mobile">
          <Link to="/" onClick={() => setMenuOpen(false)}>{t('home')}</Link>
          <Link to="/zinas" onClick={() => setMenuOpen(false)}>{t('news')}</Link>
          <Link to="/forums" onClick={() => setMenuOpen(false)}>{t('forum')}</Link>
          <Link to="/materiali" onClick={() => setMenuOpen(false)}>{t('materials')}</Link>
          {user ? (
            <>
              <Link to="/profils" onClick={() => setMenuOpen(false)}>{t('profileTitle')}</Link>
              {user.role === 'admin' && <Link to="/admin" onClick={() => setMenuOpen(false)}>{t('admin')}</Link>}
              <button onClick={() => { handleLogout(); setMenuOpen(false); }}>{t('logout')}</button>
            </>
          ) : (
            <>
              <Link to="/pieteikties" onClick={() => setMenuOpen(false)}>{t('login')}</Link>
              <Link to="/registreties" onClick={() => setMenuOpen(false)}>{t('register')}</Link>
            </>
          )}
          <button onClick={toggleLang} className="mobile-lang-btn">{lang === 'lv' ? 'Switch to EN' : 'Pārslēgt uz LV'}</button>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
