import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateMe } from '../services/api';

const Profile = () => {
  const { user, loginUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateMe(formData);
      loginUser(localStorage.getItem('token'), res.data);
      setSuccess('Profils veiksmīgi atjaunināts');
    } catch (err) {
      setError(err.response?.data?.message || 'Kļūda atjauninot profilu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '600px' }}>
      <div className="page-header">
        <h1>Mans profils</h1>
        <p>Pārvaldi sava konta informāciju</p>
      </div>

      {/* User info card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 700, color: 'white', flexShrink: 0,
          }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              {user?.firstName} {user?.lastName}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {user?.email}
            </div>
            <div style={{ marginTop: '0.4rem' }}>
              <span className={`badge badge-${user?.role === 'admin' ? 'admin' : 'user'}`}>
                {user?.role === 'admin' ? 'Administrators' : 'Lietotājs'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="card">
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.2rem' }}>Rediģēt profilu</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Vārds</label>
              <input
                type="text"
                name="firstName"
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
              value={user?.email}
              disabled
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            />
          </div>

          {success && (
            <div style={{ color: 'var(--success)', fontSize: '0.9rem', marginBottom: '0.8rem' }}>
              ✓ {success}
            </div>
          )}
          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saglabā...' : 'Saglabāt izmaiņas'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;