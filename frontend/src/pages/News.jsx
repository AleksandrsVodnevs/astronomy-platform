import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNews } from '../services/api';
import { useLang } from '../context/LanguageContext';
import { timeAgo } from '../utils/timeAgo';
import './News.css';

const News = () => {
  const { t, lang } = useLang();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getNews().then((res) => setNews(res.data)).catch(console.error).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="loading">{t('loading')}</div>;
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="page-header"><h1>{t('newsTitle')}</h1><p>{t('newsSubtitle')}</p></div>
      {news.length === 0 ? <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t('noNewsYet')}</div> : (
        <div className="news-grid">
          {news.map((item) => (
            <Link to={`/zinas/${item.id}`} key={item.id} className="news-item">
              {item.imageUrl && (
                <div className="news-item-image">
                  <img src={item.imageUrl} alt={item.title} />
                </div>
              )}
              <div className="news-item-body">
                <div className="news-item-header">
                  <span className="news-item-date">{timeAgo(item.createdAt, lang)}</span>
                </div>
                <h2>{item.title}</h2>
                <p>{item.content.substring(0, 130)}...</p>
                {item.sourceUrl && <span className="news-source">{lang === 'en' ? 'Source' : 'Avots'}: {item.sourceUrl.replace(/^https?:\/\//, '').split('/')[0]}</span>}
                <span className="news-read-more">{t('readMore')}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default News;
