import { useState, useEffect } from 'react';
import { getUsers, updateUserRole, updateUserStatus, createNews, createMaterial } from '../services/api';
import { useLang } from '../context/LanguageContext';
import Avatar from '../components/Avatar';
import ImageUpload from '../components/ImageUpload';
import './Admin.css';

const Admin = () => {
  const { t, lang } = useLang();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  const [newsForm, setNewsForm] = useState({ title: '', content: '', sourceUrl: '' });
  const [newsImage, setNewsImage] = useState('');
  const [newsSuccess, setNewsSuccess] = useState('');
  const [newsError, setNewsError] = useState('');
  const [newsLoading, setNewsLoading] = useState(false);

  const [matForm, setMatForm] = useState({ title: '', content: '', category: 'Astronomija', difficulty: 'Iesācējs' });
  const [matImage, setMatImage] = useState('');
  const [matSuccess, setMatSuccess] = useState('');
  const [matError, setMatError] = useState('');
  const [matLoading, setMatLoading] = useState(false);

  useEffect(() => { getUsers().then((res) => setUsers(res.data)).catch(console.error).finally(() => setLoading(false)); }, []);

  const handleRoleChange = async (id, role) => {
    try { await updateUserRole(id, role); setUsers(users.map((u) => u.id === id ? { ...u, role } : u)); } catch { alert('Kļūda'); }
  };
  const handleStatusChange = async (id, status) => {
    try { await updateUserStatus(id, status); setUsers(users.map((u) => u.id === id ? { ...u, status } : u)); } catch { alert('Kļūda'); }
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.content) return setNewsError(lang === 'en' ? 'Title and content are required' : 'Virsraksts un saturs ir obligāti');
    setNewsLoading(true);
    try {
      await createNews({ ...newsForm, imageUrl: newsImage });
      setNewsForm({ title: '', content: '', sourceUrl: '' });
      setNewsImage('');
      setNewsSuccess(t('published'));
      setNewsError('');
    } catch (err) { setNewsError(err.response?.data?.message || 'Kļūda'); }
    finally { setNewsLoading(false); }
  };

  const handleMatSubmit = async (e) => {
    e.preventDefault();
    if (!matForm.title || !matForm.content) return setMatError(lang === 'en' ? 'Title and content are required' : 'Virsraksts un saturs ir obligāti');
    setMatLoading(true);
    try {
      await createMaterial({ ...matForm, imageUrl: matImage });
      setMatForm({ title: '', content: '', category: 'Astronomija', difficulty: 'Iesācējs' });
      setMatImage('');
      setMatSuccess(t('materialAdded'));
      setMatError('');
    } catch (err) { setMatError(err.response?.data?.message || 'Kļūda'); }
    finally { setMatLoading(false); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString(lang === 'en' ? 'en-GB' : 'lv-LV');

  const TABS = [
    { key: 'users',     label: `${t('usersTab')} (${users.length})` },
    { key: 'news',      label: t('newsTab') },
    { key: 'materials', label: t('materialsTab') },
  ];

  return (
    <div className="adm-page container">

      {/* Page header */}
      <div className="adm-header">
        <div>
          <h1 className="adm-title">{t('adminTitle')}</h1>
          <p className="adm-subtitle">{t('adminSubtitle')}</p>
        </div>
      </div>

      {/* Tab nav */}
      <div className="adm-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`adm-tab${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---- Users ---- */}
      {activeTab === 'users' && (
        <div className="adm-section">
          {loading ? <div className="loading">{t('loading')}</div> : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>{lang === 'en' ? 'User' : 'Lietotājs'}</th>
                    <th>{lang === 'en' ? 'Email' : 'E-pasts'}</th>
                    <th>{t('registeredAt')}</th>
                    <th>{t('role')}</th>
                    <th>{t('status')}</th>
                    <th>{lang === 'en' ? 'Actions' : 'Darbības'}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="adm-user-cell">
                          <Avatar user={u} size={30} />
                          <span className="adm-user-name">{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td className="adm-muted">{u.email}</td>
                      <td className="adm-muted">{formatDate(u.createdAt)}</td>
                      <td>
                        <span className={`adm-role-badge adm-role-${u.role}`}>
                          {u.role === 'admin' ? t('roleAdmin') : t('roleUser')}
                        </span>
                      </td>
                      <td>
                        <span className={`adm-status-badge adm-status-${u.status}`}>
                          {u.status === 'active' ? (lang === 'en' ? 'Active' : 'Aktīvs') : (lang === 'en' ? 'Blocked' : 'Bloķēts')}
                        </span>
                      </td>
                      <td>
                        <div className="adm-actions">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="adm-select"
                          >
                            <option value="user">{t('roleUser')}</option>
                            <option value="admin">{t('roleAdmin')}</option>
                          </select>
                          <button
                            className={`adm-action-btn ${u.status === 'active' ? 'danger' : 'primary'}`}
                            onClick={() => handleStatusChange(u.id, u.status === 'active' ? 'blocked' : 'active')}
                          >
                            {u.status === 'active' ? t('block') : t('unblock')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ---- News form ---- */}
      {activeTab === 'news' && (
        <div className="adm-section">
          <div className="adm-form-wrap">
            <div className="adm-form-title">
              <h2>{t('publishNews')}</h2>
              <p>{lang === 'en' ? 'Published articles appear on the news page immediately.' : 'Publicētie raksti nekavējoties parādās ziņu lapā.'}</p>
            </div>
            <form onSubmit={handleNewsSubmit} className="adm-form">
              <div className="adm-form-row">
                <div className="form-group">
                  <label>{t('title')}</label>
                  <input
                    type="text"
                    placeholder={lang === 'en' ? 'Article title' : 'Ziņas virsraksts'}
                    value={newsForm.title}
                    onChange={(e) => { setNewsForm({ ...newsForm, title: e.target.value }); setNewsSuccess(''); }}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{t('content')}</label>
                <textarea
                  placeholder={lang === 'en' ? 'Article content...' : 'Ziņas teksts...'}
                  value={newsForm.content}
                  onChange={(e) => { setNewsForm({ ...newsForm, content: e.target.value }); setNewsSuccess(''); }}
                  rows={8}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('sourceUrl')} <span className="adm-optional">{lang === 'en' ? '(optional)' : '(neobligāts)'}</span></label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={newsForm.sourceUrl}
                  onChange={(e) => setNewsForm({ ...newsForm, sourceUrl: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>{lang === 'en' ? 'Cover image' : 'Vāka attēls'} <span className="adm-optional">{lang === 'en' ? '(optional)' : '(neobligāts)'}</span></label>
                <ImageUpload onUpload={setNewsImage} currentImage={newsImage} label={lang === 'en' ? 'Upload cover image' : 'Augšupielādēt vāka attēlu'} />
              </div>
              <div className="adm-form-footer">
                {newsSuccess && <span className="adm-success">{newsSuccess}</span>}
                {newsError && <span className="form-error">{newsError}</span>}
                <button type="submit" className="btn btn-primary" disabled={newsLoading}>
                  {newsLoading ? t('publishing') : t('publish')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---- Materials form ---- */}
      {activeTab === 'materials' && (
        <div className="adm-section">
          <div className="adm-form-wrap">
            <div className="adm-form-title">
              <h2>{t('publishMaterial')}</h2>
              <p>{lang === 'en' ? 'Educational materials support Markdown formatting.' : 'Izglītojošie materiāli atbalsta Markdown formatēšanu.'}</p>
            </div>
            <div className="adm-md-hint">
              {lang === 'en'
                ? '## Heading  ·  **bold**  ·  *italic*  ·  - list item  ·  > quote  ·  `code`'
                : '## Virsraksts  ·  **treknraksts**  ·  *slīpraksts*  ·  - saraksts  ·  > citāts  ·  `kods`'
              }
            </div>
            <form onSubmit={handleMatSubmit} className="adm-form">
              <div className="form-group">
                <label>{t('title')}</label>
                <input
                  type="text"
                  placeholder={lang === 'en' ? 'Material title' : 'Materiāla virsraksts'}
                  value={matForm.title}
                  onChange={(e) => { setMatForm({ ...matForm, title: e.target.value }); setMatSuccess(''); }}
                  required
                />
              </div>
              <div className="adm-two-col">
                <div className="form-group">
                  <label>{t('category')}</label>
                  <select value={matForm.category} onChange={(e) => setMatForm({ ...matForm, category: e.target.value })}>
                    <option value="Astronomija">{lang === 'en' ? 'Astronomy' : 'Astronomija'}</option>
                    <option value="Astrofotogrāfija">{lang === 'en' ? 'Astrophotography' : 'Astrofotogrāfija'}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{t('difficultyLabel')}</label>
                  <select value={matForm.difficulty} onChange={(e) => setMatForm({ ...matForm, difficulty: e.target.value })}>
                    <option value="Iesācējs">{lang === 'en' ? 'Beginner' : 'Iesācējs'}</option>
                    <option value="Vidējs">{lang === 'en' ? 'Intermediate' : 'Vidējs'}</option>
                    <option value="Pieredzējis">{lang === 'en' ? 'Advanced' : 'Pieredzējis'}</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>{t('content')}</label>
                <textarea
                  placeholder={lang === 'en' ? '## Introduction\n\nWrite your guide here...' : '## Ievads\n\nRakstiet savu rokasgrāmatu šeit...'}
                  value={matForm.content}
                  onChange={(e) => { setMatForm({ ...matForm, content: e.target.value }); setMatSuccess(''); }}
                  rows={14}
                  required
                  style={{ fontFamily: 'monospace', fontSize: '0.88rem' }}
                />
              </div>
              <div className="form-group">
                <label>{lang === 'en' ? 'Cover image' : 'Vāka attēls'} <span className="adm-optional">{lang === 'en' ? '(optional)' : '(neobligāts)'}</span></label>
                <ImageUpload onUpload={setMatImage} currentImage={matImage} label={lang === 'en' ? 'Upload cover image' : 'Augšupielādēt vāka attēlu'} />
              </div>
              <div className="adm-form-footer">
                {matSuccess && <span className="adm-success">{matSuccess}</span>}
                {matError && <span className="form-error">{matError}</span>}
                <button type="submit" className="btn btn-primary" disabled={matLoading}>
                  {matLoading ? t('publishing') : t('addMaterial')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Admin;
