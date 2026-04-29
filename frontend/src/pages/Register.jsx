import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError('Paroles nesakrīt');
    }

    if (formData.password.length < 8) {
      return setError('Parole ir pārāk īsa (min. 8 simboli)');
    }

    setLoading(true);
    try {
      const res = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      loginUser(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Reģistrācijas kļūda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🔭</span>
          <h1>Reģistrēties</h1>
          <p>Pievienojies astronomijas kopienai</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Vārds</label>
              <input
                type="text"
                name="firstName"
                placeholder="Jānis"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Uzvārds</label>
              <input
                type="text"
                name="lastName"
                placeholder="Bērziņš"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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
              placeholder="Min. 8 simboli"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Apstiprināt paroli</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Atkārtojiet paroli"
              value={formData.confirmPassword}
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
            {loading ? 'Reģistrējos...' : 'Reģistrēties'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Jau ir konts? <Link to="/pieteikties">Pieteikties</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;