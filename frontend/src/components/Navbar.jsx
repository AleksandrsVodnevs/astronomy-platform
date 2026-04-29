import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/forums?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">🔭</span>
          <span className="navbar-title">AstroLV</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Sākums</Link>
          <Link to="/zinas" className="nav-link">Ziņas</Link>
          <Link to="/forums" className="nav-link">Forums</Link>
        </div>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Meklēt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        <div className="navbar-auth">
          {user ? (
            <div className="navbar-user">
              <Link to="/profils" className="navbar-username">
                {user.firstName}
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link admin-link">Admin</Link>
              )}
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Iziet
              </button>
            </div>
          ) : (
            <div className="navbar-auth-buttons">
              <Link to="/pieteikties" className="btn btn-secondary btn-sm">
                Pieteikties
              </Link>
              <Link to="/registreties" className="btn btn-primary btn-sm">
                Reģistrēties
              </Link>
            </div>
          )}
        </div>

        <button className="navbar-burger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="navbar-mobile">
          <Link to="/" onClick={() => setMenuOpen(false)}>Sākums</Link>
          <Link to="/zinas" onClick={() => setMenuOpen(false)}>Ziņas</Link>
          <Link to="/forums" onClick={() => setMenuOpen(false)}>Forums</Link>
          {user ? (
            <>
              <Link to="/profils" onClick={() => setMenuOpen(false)}>Profils</Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Iziet</button>
            </>
          ) : (
            <>
              <Link to="/pieteikties" onClick={() => setMenuOpen(false)}>Pieteikties</Link>
              <Link to="/registreties" onClick={() => setMenuOpen(false)}>Reģistrēties</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;