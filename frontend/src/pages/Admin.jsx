import { useState, useEffect } from 'react';
import { getUsers, updateUserRole, updateUserStatus, createNews } from '../services/api';
import './Admin.css';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [newsForm, setNewsForm] = useState({ title: '', content: '', sourceUrl: '' });
  const [newsSuccess, setNewsSuccess] = useState('');
  const [newsError, setNewsError] = useState('');
  const [newsLoading, setNewsLoading] = useState(false);

  useEffect(() => {
    getUsers()
      .then((res) => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      setUsers(users.map((u) => u.id === id ? { ...u, role } : u));
    } catch {
      alert('Kļūda mainot lomu');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateUserStatus(id, status);
      setUsers(users.map((u) => u.id === id ? { ...u, status } : u));
    } catch {
      alert('Kļūda mainot statusu');
    }
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.content) {
      return setNewsError('Virsraksts un saturs ir obligāti');
    }
    setNewsLoading(true);
    try {
      await createNews(newsForm);
      setNewsForm({ title: '', content: '', sourceUrl: '' });
      setNewsSuccess('Ziņa veiksmīgi publicēta!');
      setNewsError('');
    } catch (err) {
      setNewsError(err.response?.data?.message || 'Kļūda publicējot ziņu');
    } finally {
      setNewsLoading(false);
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('lv-LV');

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="page-header">
        <h1>⚙ Administrācijas panelis</h1>
        <p>Pārvaldi lietotājus un satura publicēšanu</p>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Lietotāji ({users.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'news' ? 'active' : ''}`}
          onClick={() => setActiveTab('news')}
        >
          📡 Publicēt ziņu
        </button>
      </div>

      {/* Users tab */}
      {activeTab === 'users' && (
        <div className="admin-section">
          {loading ? (
            <div className="loading">Ielādē...</div>
          ) : (
            <div className="users-table-wrap">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Vārds Uzvārds</th>
                    <th>E-pasts</th>
                    <th>Reģistrējās</th>
                    <th>Loma</th>
                    <th>Statuss</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.firstName} {u.lastName}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{u.email}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formatDate(u.createdAt)}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="admin-select"
                        >
                          <option value="user">Lietotājs</option>
                          <option value="admin">Administrators</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm ${u.status === 'active' ? 'btn-danger' : 'btn-primary'}`}
                          onClick={() => handleStatusChange(u.id, u.status === 'active' ? 'blocked' : 'active')}
                        >
                          {u.status === 'active' ? 'Bloķēt' : 'Atbloķēt'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* News tab */}
      {activeTab === 'news' && (
        <div className="admin-section">
          <div className="card" style={{ maxWidth: '700px' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1.2rem' }}>Publicēt jaunu ziņu</h2>
            <form onSubmit={handleNewsSubmit}>
              <div className="form-group">
                <label>Virsraksts</label>
                <input
                  type="text"
                  placeholder="Ziņas virsraksts"
                  value={newsForm.title}
                  onChange={(e) => { setNewsForm({ ...newsForm, title: e.target.value }); setNewsSuccess(''); }}
                  required
                />
              </div>
              <div className="form-group">
                <label>Saturs</label>
                <textarea
                  placeholder="Ziņas teksts..."
                  value={newsForm.content}
                  onChange={(e) => { setNewsForm({ ...newsForm, content: e.target.value }); setNewsSuccess(''); }}
                  rows={6}
                  required
                />
              </div>
              <div className="form-group">
                <label>Avota saite (neobligāts)</label>
                <input
                  type="url"
                  placeholder="https://example.com/raksts"
                  value={newsForm.sourceUrl}
                  onChange={(e) => setNewsForm({ ...newsForm, sourceUrl: e.target.value })}
                />
              </div>

              {newsSuccess && (
                <div style={{ color: 'var(--success)', fontSize: '0.9rem', marginBottom: '0.8rem' }}>
                  ✓ {newsSuccess}
                </div>
              )}
              {newsError && <div className="form-error">{newsError}</div>}

              <button type="submit" className="btn btn-primary" disabled={newsLoading}>
                {newsLoading ? 'Publicē...' : 'Publicēt ziņu'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;