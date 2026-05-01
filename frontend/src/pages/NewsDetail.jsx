import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getNewsItem, deleteNews } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { timeAgo } from '../utils/timeAgo';

const NewsDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getNewsItem(id).then((res) => setItem(res.data)).catch(console.error).finally(() => setLoading(false)); }, [id]);
  const handleDelete = async () => {
    if (!window.confirm(lang === 'en' ? 'Delete this article?' : 'Dzēst šo ziņu?')) return;
    try { await deleteNews(id); navigate('/zinas'); } catch { alert('Kļūda'); }
  };
  if (loading) return <div className="loading">{t('loading')}</div>;
  if (!item) return <div className="error">{lang === 'en' ? 'Article not found' : 'Ziņa nav atrasta'}</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '800px' }}>
      <Link to="/zinas" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{t('backToNews')}</Link>
      <div className="card" style={{ marginTop: '1.2rem' }}>
        {/* News image */}
        {item.imageUrl && (
          <div style={{ margin: '-1.5rem -1.5rem 1.5rem', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>
            <img src={item.imageUrl} alt={item.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }} />
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {timeAgo(item.createdAt, lang)} &middot; {item.admin?.firstName} {item.admin?.lastName}
          </span>
          {user?.role === 'admin' && <button className="btn btn-danger btn-sm" onClick={handleDelete}>{t('delete')}</button>}
        </div>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '1.2rem', lineHeight: '1.35' }}>{item.title}</h1>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.85', whiteSpace: 'pre-wrap', fontSize: '0.97rem' }}>{item.content}</div>
        {item.sourceUrl && (
          <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <a href={item.sourceUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.88rem', color: 'var(--accent)' }}>{t('originalSource')}</a>
          </div>
        )}
      </div>
    </div>
  );
};
export default NewsDetail;
