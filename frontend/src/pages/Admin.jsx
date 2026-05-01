import { useState, useEffect } from 'react';
import { getUsers, updateUserRole, updateUserStatus, createNews, createMaterial } from '../services/api';
import { useLang } from '../context/LanguageContext';
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
    }
    catch (err) { setNewsError(err.response?.data?.message || 'Kļūda'); }
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
    }
    catch (err) { setMatError(err.response?.data?.message || 'Kļūda'); }
    finally { setMatLoading(false); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString(lang === 'en' ? 'en-GB' : 'lv-LV');

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="page-header"><h1>{t('adminTitle')}</h1><p>{t('adminSubtitle')}</p></div>
      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>{t('usersTab')} ({users.length})</button>
        <button className={`admin-tab ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>{t('newsTab')}</button>
        <button className={`admin-tab ${activeTab === 'materials' ? 'active' : ''}`} onClick={() => setActiveTab('materials')}>{t('materialsTab')}</button>
      </div>

      {activeTab === 'users' && (
        <div className="admin-section">
          {loading ? <div className="loading">{t('loading')}</div> : (
            <div className="users-table-wrap">
              <table className="users-table">
                <thead><tr><th>{lang === 'en' ? 'Name' : 'Vārds Uzvārds'}</th><th>{lang === 'en' ? 'Email' : 'E-pasts'}</th><th>{t('registeredAt')}</th><th>{t('role')}</th><th>{t('status')}</th></tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.firstName} {u.lastName}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{u.email}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formatDate(u.createdAt)}</td>
                      <td><select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)} className="admin-select"><option value="user">{t('roleUser')}</option><option value="admin">{t('roleAdmin')}</option></select></td>
                      <td><button className={`btn btn-sm ${u.status === 'active' ? 'btn-danger' : 'btn-primary'}`} onClick={() => handleStatusChange(u.id, u.status === 'active' ? 'blocked' : 'active')}>{u.status === 'active' ? t('block') : t('unblock')}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'news' && (
        <div className="admin-section">
          <div className="card" style={{ maxWidth: '740px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.3rem' }}>{t('publishNews')}</h2>
            <form onSubmit={handleNewsSubmit}>
              <div className="form-group"><label>{t('title')}</label><input type="text" placeholder={lang === 'en' ? 'Article title' : 'Ziņas virsraksts'} value={newsForm.title} onChange={(e) => { setNewsForm({ ...newsForm, title: e.target.value }); setNewsSuccess(''); }} required /></div>
              <div className="form-group"><label>{t('content')}</label><textarea placeholder={lang === 'en' ? 'Article content...' : 'Ziņas teksts...'} value={newsForm.content} onChange={(e) => { setNewsForm({ ...newsForm, content: e.target.value }); setNewsSuccess(''); }} rows={6} required /></div>
              <div className="form-group"><label>{t('sourceUrl')}</label><input type="url" placeholder="https://example.com" value={newsForm.sourceUrl} onChange={(e) => setNewsForm({ ...newsForm, sourceUrl: e.target.value })} /></div>
              <div className="form-group">
                <label>{lang === 'en' ? 'Cover image' : 'Vāka attēls'}</label>
                <ImageUpload onUpload={setNewsImage} currentImage={newsImage} label={lang === 'en' ? 'Add cover image (optional)' : 'Pievienot vāka attēlu (neobligāts)'} />
              </div>
              {newsSuccess && <div style={{ color: 'var(--success)', fontSize: '0.88rem', marginBottom: '0.8rem' }}>{newsSuccess}</div>}
              {newsError && <div className="form-error">{newsError}</div>}
              <button type="submit" className="btn btn-primary" disabled={newsLoading}>{newsLoading ? t('publishing') : t('publish')}</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'materials' && (
        <div className="admin-section">
          <div className="card" style={{ maxWidth: '740px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.3rem' }}>{t('publishMaterial')}</h2>
            <div className="admin-md-hint">
              {lang === 'en'
                ? 'Content supports Markdown — use ## headings, **bold**, *italic*, - lists, > quotes, `code`'
                : 'Saturs atbalsta Markdown — izmantojiet ## virsrakstus, **treknrakstu**, *slīprakstu**, - sarakstus, > citātus, `kodu`'
              }
            </div>
            <form onSubmit={handleMatSubmit}>
              <div className="form-group"><label>{t('title')}</label><input type="text" placeholder={lang === 'en' ? 'Material title' : 'Materiāla virsraksts'} value={matForm.title} onChange={(e) => { setMatForm({ ...matForm, title: e.target.value }); setMatSuccess(''); }} required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
              <div className="form-group"><label>{t('content')}</label><textarea placeholder={lang === 'en' ? '## Introduction\n\nWrite your guide here. Supports **Markdown**...' : '## Ievads\n\nRakstiet savu rokasgrāmatu šeit. Atbalsta **Markdown**...'} value={matForm.content} onChange={(e) => { setMatForm({ ...matForm, content: e.target.value }); setMatSuccess(''); }} rows={12} required style={{ fontFamily: 'monospace', fontSize: '0.88rem' }} /></div>
              <div className="form-group">
                <label>{lang === 'en' ? 'Cover image' : 'Vāka attēls'}</label>
                <ImageUpload onUpload={setMatImage} currentImage={matImage} label={lang === 'en' ? 'Add cover image (optional)' : 'Pievienot vāka attēlu (neobligāts)'} />
              </div>
              {matSuccess && <div style={{ color: 'var(--success)', fontSize: '0.88rem', marginBottom: '0.8rem' }}>{matSuccess}</div>}
              {matError && <div className="form-error">{matError}</div>}
              <button type="submit" className="btn btn-primary" disabled={matLoading}>{matLoading ? t('publishing') : t('addMaterial')}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Admin;
