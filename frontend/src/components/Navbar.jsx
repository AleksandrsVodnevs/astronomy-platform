import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import BlackHoleLogo from './BlackHoleLogo';
import Avatar from './Avatar';
import './Navbar.css';

const LANGS = [
  { code: 'lv', label: 'LV', name: 'Latviešu' },
  { code: 'en', label: 'EN', name: 'English'  },
  { code: 'ru', label: 'RU', name: 'Русский'  },
  { code: 'de', label: 'DE', name: 'Deutsch'  },
  { code: 'fr', label: 'FR', name: 'Français' },
];

const TranslateDropdown = () => {
  const { changeLang } = useLang();
  const [open, setOpen] = useState(false);
  // Use a dedicated localStorage key as the source of truth for the active GT language.
  // Cookies can have domain/path issues that prevent reliable deletion before reload;
  // localStorage.removeItem is always synchronous and guaranteed to work.
  const [activeLang, setActiveLang] = useState(
    () => localStorage.getItem('gt-lang') || localStorage.getItem('lang') || 'lv'
  );
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const clearGtCookie = () => {
    const exp = 'expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    document.cookie = `googtrans=; ${exp}`;
    document.cookie = `googtrans=; ${exp}; domain=${location.hostname}`;
  };

  const handleSelect = (code) => {
    setActiveLang(code);
    setOpen(false);

    // Every language goes through Google Translate with auto-detect source.
    // /auto/<target> means Google detects whatever language the text is in
    // (Latvian, English, mixed) and translates it to the chosen target.
    localStorage.setItem('gt-lang', code);
    changeLang('lv');
    clearGtCookie();
    document.cookie = `googtrans=/auto/${code}; path=/`;
    document.cookie = `googtrans=/auto/${code}; path=/; domain=${location.hostname}`;
    window.location.reload();
  };

  const current = LANGS.find(l => l.code === activeLang) || LANGS[0];

  return (
    <div className="translate-wrap" ref={wrapRef}>
      <button className="translate-btn" onClick={() => setOpen(o => !o)}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        {current.label}
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div className="translate-dropdown">
          {LANGS.map(l => (
            <button key={l.code} onClick={() => handleSelect(l.code)} className={`td-item${activeLang === l.code ? ' active' : ''}`}>
              <span className="td-code">{l.label}</span>
              <span className="td-name">{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { t } = useLang();
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
      {/* Hidden Google Translate init — powers the combo select used by TranslateDropdown */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', top: 0, width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }} />
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
        <TranslateDropdown />
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
        </div>
      )}
    </nav>
  );
};
export default Navbar;
