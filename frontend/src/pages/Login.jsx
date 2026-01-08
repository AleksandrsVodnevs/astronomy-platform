import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(formData);
      loginUser(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Pieteikšanās kļūda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🔭</span>
          <h1>Pieteikties</h1>
          <p>Laipni lūdzam atpakaļ!</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-pasta adrese</label>
            <input
              type="email"
              name="email"
              placeholder="jusu@epasts.lv"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Parole</label>
            <input
              type="password"
              name="password"
              placeholder="Ievadiet paroli"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? 'Pieteicos...' : 'Pieteikties'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Nav konta? <Link to="/registreties">Reģistrēties</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;