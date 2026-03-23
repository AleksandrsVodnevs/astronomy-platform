import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getNewsItem, deleteNews, getNews } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { timeAgo } from '../utils/timeAgo';
import './NewsDetail.css';

const NewsDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewsItem(id).then((res) => setItem(res.data)).catch(console.error).finally(() => setLoading(false));
    getNews().then((res) => setRelated(res.data.filter((n) => n.id !== parseInt(id)).slice(0, 3))).catch(() => {});
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(lang === 'en' ? 'Delete this article?' : 'Dzēst šo ziņu?')) return;
    try { await deleteNews(id); navigate('/zinas'); } catch { alert('Kļūda'); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString(lang === 'en' ? 'en-GB' : 'lv-LV', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return <div className="loading">{t('loading')}</div>;
  if (!item) return <div className="error">{lang === 'en' ? 'Article not found' : 'Ziņa nav atrasta'}</div>;

  return (
    <div className="nd-page">

      {/* Back bar */}
      <div className="nd-topbar container">
        <Link to="/zinas" className="nd-back">
          {t('backToNews')}
        </Link>
        {user?.role === 'admin' && (
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>{t('delete')}</button>
        )}
      </div>

      {/* Hero */}
      <div className={`nd-hero${item.imageUrl ? ' nd-hero--img' : ''}`}>
        {item.imageUrl && <div className="nd-hero-bg" style={{ backgroundImage: `url(${item.imageUrl})` }} />}
        <div className="nd-hero-content container">
          <div className="nd-meta">
            <span className="nd-meta-date">{formatDate(item.createdAt)}</span>
            {item.admin && (
              <>
                <span className="nd-meta-sep" />
                <span className="nd-meta-author">{item.admin.firstName} {item.admin.lastName}</span>
              </>
            )}
            {item.sourceUrl && (
              <>
                <span className="nd-meta-sep" />
                <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="nd-meta-source">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  {item.sourceUrl.replace(/^https?:\/\//, '').split('/')[0]}
                </a>
              </>
            )}
          </div>
          <h1 className="nd-hero-title">{item.title}</h1>
        </div>
      </div>

      {/* Article body */}
      <div className="nd-body">
        <p className="nd-content">{item.content}</p>
        {item.sourceUrl && (
          <div className="nd-source-row">
            <span>{lang === 'en' ? 'Original source' : 'Oriģinālais avots'}:</span>
            <a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.sourceUrl}</a>
          </div>
        )}
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div className="nd-related container">
          <p className="nd-related-label">{lang === 'en' ? 'More articles' : 'Vairāk ziņu'}</p>
          <div className="nd-related-grid">
            {related.map((n) => (
              <Link to={`/zinas/${n.id}`} key={n.id} className="nd-related-card">
                <div className="nd-related-thumb" style={n.imageUrl ? { backgroundImage: `url(${n.imageUrl})` } : {}} />
                <div className="nd-related-info">
                  <span className="nd-related-date">{timeAgo(n.createdAt, lang)}</span>
                  <h3>{n.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default NewsDetail;
